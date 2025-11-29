import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../types/errorTypes';

/**
 * Middleware to handle validation results
 */
export const validate = (req: Request, __res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg
    }));

    throw new ValidationError('Validation failed', formattedErrors);
  }

  next();
};