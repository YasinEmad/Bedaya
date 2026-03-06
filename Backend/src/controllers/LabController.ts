import { Request, Response, NextFunction } from 'express';
import { labService } from '../services/LabService';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class LabController {
  /**
   * Create Lab Test
   */
  createLabTest = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const labTest = await labService.createLabTest(req.body);
      ApiResponse.created(res, labTest, 'Lab test recorded successfully');
    }
  );

  /**
   * Get Lab Tests by Patient
   */
  getLabTestsByPatient = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { patientId } = req.params;
      const { testType, page = '1', limit = '20' } = req.query;

      const result = await labService.getLabTestsByPatient(
        patientId,
        testType as string,
        parseInt(page as string),
        parseInt(limit as string)
      );

      ApiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Lab tests retrieved successfully'
      );
    }
  );

  /**
   * Get Lab Test by ID
   */
  getLabTestById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { testId } = req.params;
      const labTest = await labService.getLabTestById(testId);
      ApiResponse.success(res, labTest, 'Lab test retrieved successfully');
    }
  );

  /**
   * Update Lab Test
   */
  updateLabTest = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { testId } = req.params;
      const labTest = await labService.updateLabTest(testId, req.body);
      ApiResponse.success(res, labTest, 'Lab test updated successfully');
    }
  );

  /**
   * Delete Lab Test
   */
  deleteLabTest = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { testId } = req.params;
      await labService.deleteLabTest(testId);
      ApiResponse.noContent(res, 'Lab test deleted successfully');
    }
  );

  /**
   * Get Recent Lab Tests
   */
  getRecentTests = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { limit = '10' } = req.query;
      const tests = await labService.getRecentTests(
        parseInt(limit as string)
      );
      ApiResponse.success(
        res,
        tests,
        'Recent lab tests retrieved successfully'
      );
    }
  );

  /**
   * Get Lab Statistics
   */
  getLabStatistics = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { startDate, endDate } = req.query;
      const stats = await labService.getLabStatistics(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      ApiResponse.success(res, stats, 'Lab statistics retrieved successfully');
    }
  );
}

export const labController = new LabController();
