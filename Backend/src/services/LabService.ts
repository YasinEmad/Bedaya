import { LabTest, ILabTest } from '../models/LabTest';
import { AppError, NotFoundError, DatabaseError } from '../utils/errorHandler';
import { getPaginationParams } from '../utils/helpers';
import logger from '../config/logger';

export class LabService {
  /**
   * Create Lab Test
   */
  async createLabTest(data: Partial<ILabTest>): Promise<ILabTest> {
    try {
      const labTest = new LabTest(data);
      const savedTest = await labTest.save();

      logger.info(`Lab test created for patient: ${data.patientId}`);
      return savedTest;
    } catch (error: any) {
      logger.error('Error creating lab test:', error);
      throw new DatabaseError('Failed to create lab test', error.message);
    }
  }

  /**
   * Get Lab Tests by Patient
   */
  async getLabTestsByPatient(
    patientId: string,
    testType?: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const { skip } = getPaginationParams(page, limit);

      let query: any = { patientId };

      if (testType) {
        query.testType = testType;
      }

      const [tests, total] = await Promise.all([
        LabTest.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ testDate: -1 })
          .lean(),
        LabTest.countDocuments(query)
      ]);

      return {
        data: tests,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      logger.error('Error fetching lab tests:', error);
      throw new DatabaseError('Failed to fetch lab tests', error.message);
    }
  }

  /**
   * Get Lab Test by ID
   */
  async getLabTestById(testId: string): Promise<ILabTest> {
    try {
      const test = await LabTest.findById(testId);

      if (!test) {
        throw new NotFoundError(`Lab test with ID ${testId} not found`);
      }

      return test;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching lab test:', error);
      throw new DatabaseError('Failed to fetch lab test', error.message);
    }
  }

  /**
   * Update Lab Test
   */
  async updateLabTest(
    testId: string,
    data: Partial<ILabTest>
  ): Promise<ILabTest> {
    try {
      const test = await LabTest.findByIdAndUpdate(
        testId,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!test) {
        throw new NotFoundError(`Lab test with ID ${testId} not found`);
      }

      logger.info(`Lab test updated: ${testId}`);
      return test;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating lab test:', error);
      throw new DatabaseError('Failed to update lab test', error.message);
    }
  }

  /**
   * Delete Lab Test
   */
  async deleteLabTest(testId: string): Promise<void> {
    try {
      const result = await LabTest.findByIdAndDelete(testId);

      if (!result) {
        throw new NotFoundError(`Lab test with ID ${testId} not found`);
      }

      logger.info(`Lab test deleted: ${testId}`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting lab test:', error);
      throw new DatabaseError('Failed to delete lab test', error.message);
    }
  }

  /**
   * Get Recent Lab Tests
   */
  async getRecentTests(limit: number = 10, testType?: string) {
    try {
      const query = testType ? { testType } : {};
      const tests = await LabTest.find(query)
        .sort({ testDate: -1 })
        .limit(limit)
        .lean();

      return tests;
    } catch (error: any) {
      logger.error('Error fetching recent lab tests:', error);
      throw new DatabaseError('Failed to fetch recent lab tests', error.message);
    }
  }

  /**
   * Get Lab Statistics
   */
  async getLabStatistics(startDate?: Date, endDate?: Date) {
    try {
      let query: any = {};

      if (startDate || endDate) {
        query.testDate = {};
        if (startDate) query.testDate.$gte = startDate;
        if (endDate) query.testDate.$lte = endDate;
      }

      const [totalTests, bloodTests, urineTests, stoolTests] = await Promise.all([
        LabTest.countDocuments(query),
        LabTest.countDocuments({ ...query, testType: 'blood' }),
        LabTest.countDocuments({ ...query, testType: 'urine' }),
        LabTest.countDocuments({ ...query, testType: 'stool' })
      ]);

      return {
        totalTests,
        breakdown: {
          blood: bloodTests,
          urine: urineTests,
          stool: stoolTests
        }
      };
    } catch (error: any) {
      logger.error('Error getting lab statistics:', error);
      throw new DatabaseError('Failed to get lab statistics', error.message);
    }
  }
}

export const labService = new LabService();
