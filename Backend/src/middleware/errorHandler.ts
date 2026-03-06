import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { ApiResponse } from '../utils/response';
import logger from '../config/logger';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.details
    );
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return ApiResponse.error(
      res,
      'Validation Error',
      400,
      err.message
    );
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if ('code' in err && err.code === 11000) {
      return ApiResponse.error(
        res,
        'Duplicate field value entered',
        409,
        err.message
      );
    }
  }

  // Default error
  return ApiResponse.error(
    res,
    'Internal Server Error',
    500,
    err.message
  );
};

/**
 * Not Found Handler Middleware
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    `Cannot find ${req.originalUrl} on this server`,
    404
  );
  next(error);
};

/**
 * Async Error Handler Wrapper
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
