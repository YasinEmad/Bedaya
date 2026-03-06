import { AdultPatient, IAdultPatient } from '../models/AdultPatient';
import { PediatricPatient, IPediatricPatient } from '../models/PediatricPatient';
import { AppError, NotFoundError, DatabaseError } from '../utils/errorHandler';
import { getPaginationParams, calculateBMI, generatePatientCode } from '../utils/helpers';
import logger from '../config/logger';

export class PatientService {
  /**
   * Create Adult Patient
   */
  async createAdultPatient(data: Partial<IAdultPatient>): Promise<IAdultPatient> {
    try {
      // Generate patient code if not provided
      if (!data.patientCode) {
        data.patientCode = generatePatientCode('P');
      }

      // Calculate BMI if weight and height provided
      if (data.anthropometry?.weight && data.anthropometry?.height) {
        data.anthropometry.BMI = calculateBMI(
          data.anthropometry.weight,
          data.anthropometry.height
        );
      }

      const patient = new AdultPatient(data);
      const savedPatient = await patient.save();

      logger.info(`Adult patient created: ${savedPatient.patientCode}`);
      return savedPatient;
    } catch (error: any) {
      logger.error('Error creating adult patient:', error);

      if (error.code === 11000) {
        throw new AppError('Patient code already exists', 409);
      }

      throw new DatabaseError('Failed to create adult patient', error.message);
    }
  }

  /**
   * Get All Adult Patients with Pagination
   */
  async getAdultPatients(
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
            { patientName: { $regex: search, $options: 'i' } },
            { patientCode: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const [patients, total] = await Promise.all([
        AdultPatient.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        AdultPatient.countDocuments(query)
      ]);

      return {
        data: patients,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      logger.error('Error fetching adult patients:', error);
      throw new DatabaseError('Failed to fetch adult patients', error.message);
    }
  }

  /**
   * Get Adult Patient by ID
   */
  async getAdultPatientById(patientCode: string): Promise<IAdultPatient> {
    try {
      const patient = await AdultPatient.findOne({
        patientCode
      });

      if (!patient) {
        throw new NotFoundError(`Adult patient with code ${patientCode} not found`);
      }

      return patient;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching adult patient:', error);
      throw new DatabaseError('Failed to fetch adult patient', error.message);
    }
  }

  /**
   * Update Adult Patient
   */
  async updateAdultPatient(
    patientCode: string,
    data: Partial<IAdultPatient>
  ): Promise<IAdultPatient> {
    try {
      // Recalculate BMI if weight or height changed
      if (data.anthropometry?.weight && data.anthropometry?.height) {
        data.anthropometry.BMI = calculateBMI(
          data.anthropometry.weight,
          data.anthropometry.height
        );
      }

      const patient = await AdultPatient.findOneAndUpdate(
        { patientCode },
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!patient) {
        throw new NotFoundError(`Adult patient with code ${patientCode} not found`);
      }

      logger.info(`Adult patient updated: ${patientCode}`);
      return patient;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating adult patient:', error);
      throw new DatabaseError('Failed to update adult patient', error.message);
    }
  }

  /**
   * Delete Adult Patient
   */
  async deleteAdultPatient(patientCode: string): Promise<void> {
    try {
      const result = await AdultPatient.deleteOne({ patientCode });

      if (result.deletedCount === 0) {
        throw new NotFoundError(`Adult patient with code ${patientCode} not found`);
      }

      logger.info(`Adult patient deleted: ${patientCode}`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting adult patient:', error);
      throw new DatabaseError('Failed to delete adult patient', error.message);
    }
  }

  /**
   * Create Pediatric Patient
   */
  async createPediatricPatient(data: Partial<IPediatricPatient>): Promise<IPediatricPatient> {
    try {
      if (!data.patientCode) {
        data.patientCode = generatePatientCode('PED');
      }

      const patient = new PediatricPatient(data);
      const savedPatient = await patient.save();

      logger.info(`Pediatric patient created: ${savedPatient.patientCode}`);
      return savedPatient;
    } catch (error: any) {
      logger.error('Error creating pediatric patient:', error);

      if (error.code === 11000) {
        throw new AppError('Patient code already exists', 409);
      }

      throw new DatabaseError('Failed to create pediatric patient', error.message);
    }
  }

  /**
   * Get All Pediatric Patients with Pagination
   */
  async getPediatricPatients(
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
            { patientName: { $regex: search, $options: 'i' } },
            { patientCode: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const [patients, total] = await Promise.all([
        PediatricPatient.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PediatricPatient.countDocuments(query)
      ]);

      return {
        data: patients,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      logger.error('Error fetching pediatric patients:', error);
      throw new DatabaseError('Failed to fetch pediatric patients', error.message);
    }
  }

  /**
   * Get Pediatric Patient by ID
   */
  async getPediatricPatientById(patientCode: string): Promise<IPediatricPatient> {
    try {
      const patient = await PediatricPatient.findOne({
        patientCode
      });

      if (!patient) {
        throw new NotFoundError(
          `Pediatric patient with code ${patientCode} not found`
        );
      }

      return patient;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching pediatric patient:', error);
      throw new DatabaseError('Failed to fetch pediatric patient', error.message);
    }
  }

  /**
   * Update Pediatric Patient
   */
  async updatePediatricPatient(
    patientCode: string,
    data: Partial<IPediatricPatient>
  ): Promise<IPediatricPatient> {
    try {
      const patient = await PediatricPatient.findOneAndUpdate(
        { patientCode },
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!patient) {
        throw new NotFoundError(
          `Pediatric patient with code ${patientCode} not found`
        );
      }

      logger.info(`Pediatric patient updated: ${patientCode}`);
      return patient;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating pediatric patient:', error);
      throw new DatabaseError('Failed to update pediatric patient', error.message);
    }
  }

  /**
   * Delete Pediatric Patient
   */
  async deletePediatricPatient(patientCode: string): Promise<void> {
    try {
      const result = await PediatricPatient.deleteOne({ patientCode });

      if (result.deletedCount === 0) {
        throw new NotFoundError(
          `Pediatric patient with code ${patientCode} not found`
        );
      }

      logger.info(`Pediatric patient deleted: ${patientCode}`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting pediatric patient:', error);
      throw new DatabaseError('Failed to delete pediatric patient', error.message);
    }
  }
}

export const patientService = new PatientService();
