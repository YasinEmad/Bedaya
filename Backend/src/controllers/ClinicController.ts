import { Request, Response, NextFunction } from 'express';
import { clinicService } from '../services/ClinicService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class ClinicController {
  /**
   * Create Clinic Visit
   */
  createClinicVisit = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const visit = await clinicService.createClinicVisit(req.body);
      ApiResponse.created(res, visit, 'Clinic visit recorded successfully');
    }
  );

  /**
   * Get Patient's Clinic Visits
   */
  getPatientClinicVisits = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      const { page = '1', limit = '20' } = req.query;

      const result = await clinicService.getPatientClinicVisits(
        patientId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      ApiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Clinic visits retrieved successfully'
      );
    }
  );

  /**
   * Get Clinic Visits by Clinic Type
   */
  getClinicVisitsByType = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { clinicType } = req.params;
      const { page = '1', limit = '20' } = req.query;

      const result = await clinicService.getClinicVisitsByType(
        clinicType,
        parseInt(page as string),
        parseInt(limit as string)
      );

      ApiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Clinic visits retrieved successfully'
      );
    }
  );

  /**
   * Get Clinic Visit by ID
   */
  getClinicVisitById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { visitId } = req.params;
      const visit = await clinicService.getClinicVisitById(visitId);
      ApiResponse.success(res, visit, 'Clinic visit retrieved successfully');
    }
  );

  /**
   * Update Clinic Visit
   */
  updateClinicVisit = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { visitId } = req.params;
      const visit = await clinicService.updateClinicVisit(visitId, req.body);
      ApiResponse.success(res, visit, 'Clinic visit updated successfully');
    }
  );

  /**
   * Delete Clinic Visit
   */
  deleteClinicVisit = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { visitId } = req.params;
      await clinicService.deleteClinicVisit(visitId);
      ApiResponse.noContent(res, 'Clinic visit deleted successfully');
    }
  );

  /**
   * Get Clinic Statistics
   */
  getClinicStatistics = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await clinicService.getClinicStatistics();
      ApiResponse.success(res, stats, 'Clinic statistics retrieved successfully');
    }
  );

  /**
   * Get Visits for Date Range
   */
  getVisitsForDateRange = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return ApiResponse.error(
          res,
          'Start date and end date are required',
          400
        );
      }

      const visits = await clinicService.getVisitsForDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      ApiResponse.success(res, visits, 'Clinic visits retrieved successfully');
    }
  );
}

export const clinicController = new ClinicController();
