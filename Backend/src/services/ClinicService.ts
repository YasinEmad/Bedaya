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
  /**
   * Get All Clinic Definitions
   */
  async getAllClinics() {
    try {
      const clinicDefinitions = [
        {
          id: 'internal-medicine',
          name: 'Internal Medicine',
          doctor: 'Dr. Sarah Chen',
          color: 'bg-blue-100 text-blue-600',
          status: 'active',
          patients: 23,
          waitTime: '15 min',
          completed: 12,
          avgTime: '18m'
        },
        {
          id: 'orthopedics',
          name: 'Orthopedics',
          doctor: 'Dr. Michael Rodriguez',
          color: 'bg-green-100 text-green-600',
          status: 'active',
          patients: 8,
          waitTime: '30 min',
          completed: 15,
          avgTime: '25m'
        },
        {
          id: 'ophthalmology',
          name: 'Ophthalmology',
          doctor: 'Dr. Lisa Wang',
          color: 'bg-purple-100 text-purple-600',
          status: 'active',
          patients: 15,
          waitTime: '20 min',
          completed: 8,
          avgTime: '12m'
        },
        {
          id: 'obstetrics-gynecology',
          name: 'Obs & Gynecology',
          doctor: 'Dr. Jennifer Adams',
          color: 'bg-pink-100 text-pink-600',
          status: 'active',
          patients: 12,
          waitTime: '25 min',
          completed: 6,
          avgTime: '22m'
        },
        {
          id: 'dermatology',
          name: 'Dermatology',
          doctor: 'Dr. David Kim',
          color: 'bg-yellow-100 text-yellow-600',
          status: 'active',
          patients: 9,
          waitTime: '40 min',
          completed: 11,
          avgTime: '15m'
        },
        {
          id: 'dental',
          name: 'Dental',
          doctor: 'Dr. Maria Gonzalez',
          color: 'bg-cyan-100 text-cyan-600',
          status: 'active',
          patients: 11,
          waitTime: '10 min',
          completed: 9,
          avgTime: '20m'
        },
        {
          id: 'cardiology',
          name: 'Cardiology',
          doctor: 'Dr. Robert Taylor',
          color: 'bg-red-100 text-red-600',
          status: 'active',
          patients: 12,
          waitTime: '35 min',
          completed: 7,
          avgTime: '28m'
        },
        {
          id: 'surgery',
          name: 'Surgery',
          doctor: 'Dr. Amanda Foster',
          color: 'bg-orange-100 text-orange-600',
          status: 'active',
          patients: 5,
          waitTime: '45 min',
          completed: 3,
          avgTime: '45m'
        },
        {
          id: 'ent',
          name: 'ENT',
          doctor: 'Dr. James Wilson',
          color: 'bg-indigo-100 text-indigo-600',
          status: 'active',
          patients: 7,
          waitTime: '18 min',
          completed: 5,
          avgTime: '16m'
        },
        {
          id: 'pediatrics-clinic',
          name: 'Pediatrics',
          doctor: 'Dr. Elena Martinez',
          color: 'bg-rose-100 text-rose-600',
          status: 'active',
          patients: 18,
          waitTime: '12 min',
          completed: 14,
          avgTime: '14m'
        }
      ];

      return clinicDefinitions;
    } catch (error: any) {
      logger.error('Error fetching clinics:', error);
      throw new DatabaseError('Failed to fetch clinics', error.message);
    }
  }

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
