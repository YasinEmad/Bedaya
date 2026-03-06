import { ClinicVisit, IClinicVisit } from '../models/ClinicVisit';
import { AppError, NotFoundError, DatabaseError } from '../utils/errorHandler';
import { getPaginationParams } from '../utils/helpers';
import logger from '../config/logger';

export class ClinicService {
  /**
   * Create Clinic Visit
   */
  async createClinicVisit(data: Partial<IClinicVisit>): Promise<IClinicVisit> {
    try {
      const visit = new ClinicVisit(data);
      const savedVisit = await visit.save();

      logger.info(
        `Clinic visit created - Patient: ${data.patientId}, Clinic: ${data.clinicType}`
      );
      return savedVisit;
    } catch (error: any) {
      logger.error('Error creating clinic visit:', error);
      throw new DatabaseError('Failed to create clinic visit', error.message);
    }
  }

  /**
   * Get Clinic Visits by Patient
   */
  async getPatientClinicVisits(
    patientId: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const { skip } = getPaginationParams(page, limit);

      const [visits, total] = await Promise.all([
        ClinicVisit.find({ patientId })
          .skip(skip)
          .limit(limit)
          .sort({ visitDate: -1 })
          .lean(),
        ClinicVisit.countDocuments({ patientId })
      ]);

      return {
        data: visits,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      logger.error('Error fetching clinic visits:', error);
      throw new DatabaseError('Failed to fetch clinic visits', error.message);
    }
  }

  /**
   * Get Clinic Visits by Clinic Type
   */
  async getClinicVisitsByType(
    clinicType: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const { skip } = getPaginationParams(page, limit);

      const [visits, total] = await Promise.all([
        ClinicVisit.find({ clinicType })
          .skip(skip)
          .limit(limit)
          .sort({ visitDate: -1 })
          .lean(),
        ClinicVisit.countDocuments({ clinicType })
      ]);

      return {
        data: visits,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      logger.error('Error fetching clinic visits:', error);
      throw new DatabaseError('Failed to fetch clinic visits', error.message);
    }
  }

  /**
   * Get Clinic Visit by ID
   */
  async getClinicVisitById(visitId: string): Promise<IClinicVisit> {
    try {
      const visit = await ClinicVisit.findById(visitId);

      if (!visit) {
        throw new NotFoundError(`Clinic visit with ID ${visitId} not found`);
      }

      return visit;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching clinic visit:', error);
      throw new DatabaseError('Failed to fetch clinic visit', error.message);
    }
  }

  /**
   * Update Clinic Visit
   */
  async updateClinicVisit(
    visitId: string,
    data: Partial<IClinicVisit>
  ): Promise<IClinicVisit> {
    try {
      const visit = await ClinicVisit.findByIdAndUpdate(
        visitId,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!visit) {
        throw new NotFoundError(`Clinic visit with ID ${visitId} not found`);
      }

      logger.info(`Clinic visit updated: ${visitId}`);
      return visit;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating clinic visit:', error);
      throw new DatabaseError('Failed to update clinic visit', error.message);
    }
  }

  /**
   * Delete Clinic Visit
   */
  async deleteClinicVisit(visitId: string): Promise<void> {
    try {
      const result = await ClinicVisit.findByIdAndDelete(visitId);

      if (!result) {
        throw new NotFoundError(`Clinic visit with ID ${visitId} not found`);
      }

      logger.info(`Clinic visit deleted: ${visitId}`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting clinic visit:', error);
      throw new DatabaseError('Failed to delete clinic visit', error.message);
    }
  }

  /**
   * Get Clinic Statistics
   */
  async getClinicStatistics() {
    try {
      const clinicTypes = [
        'internal-medicine',
        'cardiology',
        'orthopedics',
        'ophthalmology',
        'obstetrics-gynecology',
        'dermatology',
        'dental',
        'surgery',
        'ent',
        'pediatrics-clinic'
      ];

      const stats = await Promise.all(
        clinicTypes.map(async (type) => ({
          clinic: type,
          total: await ClinicVisit.countDocuments({ clinicType: type })
        }))
      );

      const totalVisits = stats.reduce((sum, s) => sum + s.total, 0);

      return {
        totalVisits,
        breakdown: stats
      };
    } catch (error: any) {
      logger.error('Error getting clinic statistics:', error);
      throw new DatabaseError('Failed to get clinic statistics', error.message);
    }
  }

  /**
   * Get Visits for Date Range
   */
  async getVisitsForDateRange(startDate: Date, endDate: Date) {
    try {
      const visits = await ClinicVisit.find({
        visitDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
        .sort({ visitDate: -1 })
        .lean();

      return visits;
    } catch (error: any) {
      logger.error('Error fetching visits for date range:', error);
      throw new DatabaseError(
        'Failed to fetch visits for date range',
        error.message
      );
    }
  }
}

export const clinicService = new ClinicService();
