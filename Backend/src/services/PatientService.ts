import { AdultPatient, IAdultPatient } from '../models/AdultPatient';
import { PediatricPatient, IPediatricPatient } from '../models/PediatricPatient';
import { ClinicVisit, IClinicVisit } from '../models/ClinicVisit';
import { AppError, NotFoundError, DatabaseError } from '../utils/errorHandler';
import { getPaginationParams, calculateBMI, generatePatientCode } from '../utils/helpers';
import logger from '../config/logger';

export class PatientService {
  /**
   * Map referral field names to clinic types
   */
  private referralFieldsToClinicTypes: {
    [key in keyof IAdultPatient['referrals'] | string]: IClinicVisit['clinicType'];
  } = {
    internalMedicine: 'internal-medicine',
    cardiology: 'cardiology',
    surgery: 'surgery',
    ophthalmology: 'ophthalmology',
    obstetricGynecology: 'obstetrics-gynecology',
    ENT: 'ent',
    dermatology: 'dermatology',
    orthopedics: 'orthopedics',
    dental: 'dental'
  };

  /**
   * Create ClinicVisit records for patient referrals
   */
  private async createClinicVisitsForReferrals(
    patientCode: string,
    patientName: string,
    referrals: IAdultPatient['referrals']
  ): Promise<void> {
    if (!referrals) return;

    try {
      const clinicVisitsToCreate: Partial<IClinicVisit>[] = [];

      // Check each referral field
      Object.entries(referrals).forEach(([key, isReferred]) => {
        if (isReferred === true) {
          const clinicType = this.referralFieldsToClinicTypes[key];
          if (clinicType) {
            clinicVisitsToCreate.push({
              patientId: patientCode,
              patientName,
              clinicType,
              doctor: 'Clinic Staff', // Default value, can be updated later
              diagnosis: 'Referral', // Default value
              treatment: 'Pending', // Default value
              visitDate: new Date()
            });
          }
        }
      });

      if (clinicVisitsToCreate.length > 0) {
        await ClinicVisit.insertMany(clinicVisitsToCreate);
        logger.info(
          `Created ${clinicVisitsToCreate.length} clinic visits for patient ${patientCode}`
        );
      }
    } catch (error: any) {
      logger.error('Error creating clinic visits for referrals:', error);
      // Don't throw error - referral still saved even if clinic visit creation fails
    }
  }

  /**
   * Get referrals that changed (new referrals added)
   */
  private getNewReferrals(
    oldReferrals: IAdultPatient['referrals'] | undefined,
    newReferrals: IAdultPatient['referrals'] | undefined
  ): IAdultPatient['referrals'] | null {
    if (!newReferrals) return null;

    const newRefs: IAdultPatient['referrals'] = {};
    Object.entries(newReferrals).forEach(([key, isReferred]) => {
      const wasReferred = oldReferrals?.[key as keyof IAdultPatient['referrals']];
      // Include only if newly set to true (wasn't true before)
      if (isReferred === true && wasReferred !== true) {
        (newRefs as any)[key] = true;
      }
    });

    return Object.keys(newRefs).length > 0 ? newRefs : null;
  }

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

      // Create clinic visits for referrals
      if (data.referrals && data.patientName) {
        await this.createClinicVisitsForReferrals(
          savedPatient.patientCode,
          savedPatient.patientName,
          data.referrals
        );
      }

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
      // Get the old patient data to check for new referrals
      const oldPatient = await AdultPatient.findOne({ patientCode }).lean();

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

      // Create clinic visits for newly added referrals
      if (data.referrals && patient.patientName) {
        const newReferrals = this.getNewReferrals(oldPatient?.referrals, data.referrals);
        if (newReferrals) {
          await this.createClinicVisitsForReferrals(
            patient.patientCode,
            patient.patientName,
            newReferrals
          );
        }
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

      // Create clinic visits for referrals
      if (data.referrals && data.patientName) {
        await this.createClinicVisitsForReferrals(
          savedPatient.patientCode,
          savedPatient.patientName,
          data.referrals
        );
      }

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
      // Get the old patient data to check for new referrals
      const oldPatient = await PediatricPatient.findOne({ patientCode }).lean();

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

      // Create clinic visits for newly added referrals
      if (data.referrals && patient.patientName) {
        const newReferrals = this.getNewReferrals(oldPatient?.referrals, data.referrals);
        if (newReferrals) {
          await this.createClinicVisitsForReferrals(
            patient.patientCode,
            patient.patientName,
            newReferrals
          );
        }
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
