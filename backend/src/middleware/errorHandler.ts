import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, IErrorResponse } from '../types/errorTypes';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = new AppError(message, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 409);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    error = new ValidationError('Validation failed', errors);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  const errorResponse: IErrorResponse = {
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message || 'Internal server error'
  };

  // Add validation errors if available
  if (error instanceof ValidationError && error.errors) {
    errorResponse.errors = error.errors;
  }

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 - Not Found
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};