import { Medicine, IMedicine } from '../models/Medicine';
import { DispensingRecord, IDispensingRecord } from '../models/Dispensing';
import { AppError, NotFoundError, DatabaseError } from '../utils/errorHandler';
import { getPaginationParams, generateUniqueId } from '../utils/helpers';
import logger from '../config/logger';

export class PharmacyService {
  /**
   * Create/Add Medicine to Inventory
   */
  async addMedicine(data: Partial<IMedicine>): Promise<IMedicine> {
    try {
      // Check if medicine with same barcode exists
      const existingMedicine = await Medicine.findOne({
        barcode: data.barcode
      });

      if (existingMedicine) {
        // Update stock instead of creating new
        existingMedicine.currentStock! += data.currentStock || 0;
        existingMedicine.lastRestocked = new Date();
        const updated = await existingMedicine.save();
        logger.info(`Medicine stock updated: ${data.medicineName}`);
        return updated;
      }

      const medicine = new Medicine(data);
      const savedMedicine = await medicine.save();

      logger.info(`New medicine added to inventory: ${savedMedicine.medicineName}`);
      return savedMedicine;
    } catch (error: any) {
      logger.error('Error adding medicine:', error);

      if (error.code === 11000) {
        throw new AppError('Medicine with this barcode already exists', 409);
      }

      throw new DatabaseError('Failed to add medicine', error.message);
    }
  }

  /**
   * Get All Medicines with Pagination
   */
  async getAllMedicines(
    page: number = 1,
    limit: number = 20,
    search?: string
  ) {
    try {
      const { skip } = getPaginationParams(page, limit);

      let query: any = {};

      if (search) {
        query = {
          $or: [
            { medicineName: { $regex: search, $options: 'i' } },
            { barcode: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const [medicines, total] = await Promise.all([
        Medicine.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ medicineName: 1 })
          .lean(),
        Medicine.countDocuments(query)
      ]);

      return {
        data: medicines,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      logger.error('Error fetching medicines:', error);
      throw new DatabaseError('Failed to fetch medicines', error.message);
    }
  }

  /**
   * Get Medicine by ID
   */
  async getMedicineById(medicineId: string): Promise<IMedicine> {
    try {
      const medicine = await Medicine.findById(medicineId);

      if (!medicine) {
        throw new NotFoundError(`Medicine with ID ${medicineId} not found`);
      }

      return medicine;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching medicine:', error);
      throw new DatabaseError('Failed to fetch medicine', error.message);
    }
  }

  /**
   * Update Medicine Stock
   */
  async updateMedicineStock(
    medicineId: string,
    quantity: number,
    operation: 'add' | 'remove' = 'add'
  ): Promise<IMedicine> {
    try {
      const medicine = await Medicine.findById(medicineId);

      if (!medicine) {
        throw new NotFoundError(`Medicine with ID ${medicineId} not found`);
      }

      if (operation === 'add') {
        medicine.currentStock! += quantity;
      } else if (operation === 'remove') {
        if (medicine.currentStock! < quantity) {
          throw new AppError('Insufficient stock', 400);
        }
        medicine.currentStock! -= quantity;
        medicine.dispensed! += quantity;
      }

      medicine.lastRestocked = new Date();
      const updated = await medicine.save();

      logger.info(
        `Medicine stock ${operation === 'add' ? 'increased' : 'decreased'}: ${medicine.medicineName}`
      );
      return updated;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating medicine stock:', error);
      throw new DatabaseError('Failed to update medicine stock', error.message);
    }
  }

  /**
   * Delete Medicine
   */
  async deleteMedicine(medicineId: string): Promise<void> {
    try {
      const result = await Medicine.findByIdAndDelete(medicineId);

      if (!result) {
        throw new NotFoundError(`Medicine with ID ${medicineId} not found`);
      }

      logger.info(`Medicine deleted: ${result.medicineName}`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting medicine:', error);
      throw new DatabaseError('Failed to delete medicine', error.message);
    }
  }

  /**
   * Record Medicine Dispensing
   */
  async dispenseMedicine(data: Partial<IDispensingRecord>): Promise<IDispensingRecord> {
    try {
      // Generate dispensing ID
      const dispensingRecord = new DispensingRecord({
        ...data,
        dispensingId: `DISP-${generateUniqueId()}`
      });

      const saved = await dispensingRecord.save();

      // Update medicine stock for each medication
      if (data.medications) {
        for (const med of data.medications) {
          await this.updateMedicineStock(med.medicineId, med.quantity, 'remove');
        }
      }

      logger.info(`Medicine dispensed for patient: ${data.patientId}`);
      return saved;
    } catch (error: any) {
      logger.error('Error dispensing medicine:', error);
      throw new DatabaseError('Failed to dispense medicine', error.message);
    }
  }

  /**
   * Get Dispensing History
   */
  async getDispensingHistory(
    page: number = 1,
    limit: number = 20,
    patientId?: string
  ) {
    try {
      const { skip } = getPaginationParams(page, limit);

      let query: any = {};

      if (patientId) {
        query.patientId = patientId;
      }

      const [records, total] = await Promise.all([
        DispensingRecord.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ dispensingDate: -1 })
          .lean(),
        DispensingRecord.countDocuments(query)
      ]);

      return {
        data: records,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      logger.error('Error fetching dispensing history:', error);
      throw new DatabaseError('Failed to fetch dispensing history', error.message);
    }
  }

  /**
   * Get Low Stock Medicines
   */
  async getLowStockMedicines() {
    try {
      const medicines = await Medicine.find({
        $expr: { $lte: ['$currentStock', '$minStockLevel'] }
      })
        .sort({ currentStock: 1 })
        .lean();

      return medicines;
    } catch (error: any) {
      logger.error('Error fetching low stock medicines:', error);
      throw new DatabaseError('Failed to fetch low stock medicines', error.message);
    }
  }

  /**
   * Get Pharmacy Statistics
   */
  async getPharmacyStatistics() {
    try {
      const [totalMedicines, lowStockCount, totalDispensed] = await Promise.all([
        Medicine.countDocuments(),
        Medicine.countDocuments({
          $expr: { $lte: ['$currentStock', '$minStockLevel'] }
        }),
        DispensingRecord.countDocuments()
      ]);

      return {
        totalMedicines,
        lowStockCount,
        totalDispensed
      };
    } catch (error: any) {
      logger.error('Error getting pharmacy statistics:', error);
      throw new DatabaseError('Failed to get pharmacy statistics', error.message);
    }
  }
}

export const pharmacyService = new PharmacyService();
