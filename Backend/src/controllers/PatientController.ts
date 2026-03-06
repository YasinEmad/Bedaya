import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/PatientService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class PatientController {
  /**
   * Create Adult Patient
   */
  createAdultPatient = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const patient = await patientService.createAdultPatient(req.body);
      ApiResponse.created(res, patient, 'Adult patient created successfully');
    }
  );

  /**
   * Get All Adult Patients
   */
  getAdultPatients = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { page = '1', limit = '20', search } = req.query;
      const result = await patientService.getAdultPatients(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );

      ApiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Adult patients retrieved successfully'
      );
    }
  );

  /**
   * Get Adult Patient by ID
   */
  getAdultPatientById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      const patient = await patientService.getAdultPatientById(patientId);
      ApiResponse.success(res, patient, 'Adult patient retrieved successfully');
    }
  );

  /**
   * Update Adult Patient
   */
  updateAdultPatient = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      const patient = await patientService.updateAdultPatient(
        patientId,
        req.body
      );
      ApiResponse.success(res, patient, 'Adult patient updated successfully');
    }
  );

  /**
   * Delete Adult Patient
   */
  deleteAdultPatient = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      await patientService.deleteAdultPatient(patientId);
      ApiResponse.noContent(res, 'Adult patient deleted successfully');
    }
  );

  /**
   * Create Pediatric Patient
   */
  createPediatricPatient = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const patient = await patientService.createPediatricPatient(req.body);
      ApiResponse.created(
        res,
        patient,
        'Pediatric patient created successfully'
      );
    }
  );

  /**
   * Get All Pediatric Patients
   */
  getPediatricPatients = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { page = '1', limit = '20', search } = req.query;
      const result = await patientService.getPediatricPatients(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );

      ApiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Pediatric patients retrieved successfully'
      );
    }
  );

  /**
   * Get Pediatric Patient by ID
   */
  getPediatricPatientById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      const patient = await patientService.getPediatricPatientById(patientId);
      ApiResponse.success(res, patient, 'Pediatric patient retrieved successfully');
    }
  );

  /**
   * Update Pediatric Patient
   */
  updatePediatricPatient = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      const patient = await patientService.updatePediatricPatient(
        patientId,
        req.body
      );
      ApiResponse.success(res, patient, 'Pediatric patient updated successfully');
    }
  );

  /**
   * Delete Pediatric Patient
   */
  deletePediatricPatient = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      await patientService.deletePediatricPatient(patientId);
      ApiResponse.noContent(res, 'Pediatric patient deleted successfully');
    }
  );
}

export const patientController = new PatientController();
