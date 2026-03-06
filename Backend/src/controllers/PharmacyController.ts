import { Request, Response, NextFunction } from 'express';
import { pharmacyService } from '../services/PharmacyService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class PharmacyController {
  /**
   * Add Medicine to Inventory
   */
  addMedicine = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const medicine = await pharmacyService.addMedicine(req.body);
      ApiResponse.created(res, medicine, 'Medicine added to inventory successfully');
    }
  );

  /**
   * Get All Medicines
   */
  getAllMedicines = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { page = '1', limit = '20', search } = req.query;
      const result = await pharmacyService.getAllMedicines(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );

      ApiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Medicines retrieved successfully'
      );
    }
  );

  /**
   * Get Medicine by ID
   */
  getMedicineById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { medicineId } = req.params;
      const medicine = await pharmacyService.getMedicineById(medicineId);
      ApiResponse.success(res, medicine, 'Medicine retrieved successfully');
    }
  );

  /**
   * Update Medicine Stock
   */
  updateMedicineStock = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { medicineId } = req.params;
      const { quantity, operation = 'add' } = req.body;

      const medicine = await pharmacyService.updateMedicineStock(
        medicineId,
        quantity,
        operation
      );

      ApiResponse.success(res, medicine, 'Medicine stock updated successfully');
    }
  );

  /**
   * Delete Medicine
   */
  deleteMedicine = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { medicineId } = req.params;
      await pharmacyService.deleteMedicine(medicineId);
      ApiResponse.noContent(res, 'Medicine deleted successfully');
    }
  );

  /**
   * Dispense Medicine
   */
  dispenseMedicine = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const dispensingRecord = await pharmacyService.dispenseMedicine(req.body);
      ApiResponse.created(
        res,
        dispensingRecord,
        'Medicine dispensed successfully'
      );
    }
  );

  /**
   * Get Dispensing History
   */
  getDispensingHistory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { page = '1', limit = '20', patientId } = req.query;
      const result = await pharmacyService.getDispensingHistory(
        parseInt(page as string),
        parseInt(limit as string),
        patientId as string
      );

      ApiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Dispensing history retrieved successfully'
      );
    }
  );

  /**
   * Get Low Stock Medicines
   */
  getLowStockMedicines = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const medicines = await pharmacyService.getLowStockMedicines();
      ApiResponse.success(res, medicines, 'Low stock medicines retrieved successfully');
    }
  );

  /**
   * Get Pharmacy Statistics
   */
  getPharmacyStatistics = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await pharmacyService.getPharmacyStatistics();
      ApiResponse.success(res, stats, 'Pharmacy statistics retrieved successfully');
    }
  );
}

export const pharmacyController = new PharmacyController();
