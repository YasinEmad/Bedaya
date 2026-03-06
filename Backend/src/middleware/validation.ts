import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../utils/response';

/**
 * Request Validation Middleware Factory
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = {
      ...req.body,
      ...req.params,
      ...req.query
    };

    const { error, value } = schema.validate(dataToValidate, {
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return ApiResponse.error(
        res,
        'Validation Error',
        400,
        messages
      );
    }

    // Merge validated data back into request body
    req.body = value;
    next();
  };
};

/**
 * Validate Query Parameters Middleware
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      stripUnknown: false
    });

    if (error) {
      return ApiResponse.error(
        res,
        'Query Validation Error',
        400,
        error.message
      );
    }

    req.query = value;
    next();
  };
};

/**
 * Validate URL Parameters Middleware
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      stripUnknown: false
    });

    if (error) {
      return ApiResponse.error(
        res,
        'Parameter Validation Error',
        400,
        error.message
      );
    }

    req.params = value;
    next();
  };
};
