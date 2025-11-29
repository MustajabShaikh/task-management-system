import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, IErrorResponse } from '../types/errorTypes';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: any,
  __req: Request,
  res: Response,
  __next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = new AppError(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    error = new ValidationError('Validation failed', errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Build error response
  const errorResponse: IErrorResponse = {
    success: false,
    message: error.message || 'Internal server error'
  };

  // Add validation errors if available
  if (error instanceof ValidationError && error.errors) {
    errorResponse.errors = error.errors;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 - Not Found
 */
export const notFound = (req: Request, __res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};