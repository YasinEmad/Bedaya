import { Response } from 'express';

export interface SuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  details?: string | object;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  timestamp: string;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    } as SuccessResponse<T>);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: string | object
  ): Response {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString()
    } as ErrorResponse);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    },
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    } as PaginatedResponse<T>);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response, message: string = 'Success'): Response {
    return res.status(204).json({
      success: true,
      statusCode: 204,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
