import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, IErrorResponse } from '../types/errorTypes';
import { STATUS_CODE, GENERAL_MESSAGES, AUTH_MESSAGES } from '../constants/constants.js';

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
    const message = GENERAL_MESSAGES.INVALID_ID;
    error = new AppError(message, STATUS_CODE.BAD_REQUEST);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, STATUS_CODE.CONFLICT);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    error = new ValidationError(GENERAL_MESSAGES.VALIDATION_FAILED, errors);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = AUTH_MESSAGES.TOKEN_INVALID;
    error = new AppError(message, STATUS_CODE.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    const message = AUTH_MESSAGES.TOKEN_EXPIRED;
    error = new AppError(message, STATUS_CODE.UNAUTHORIZED);
  }

  const errorResponse: IErrorResponse = {
    success: false,
    statusCode: error.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR,
    message: error.message || GENERAL_MESSAGES.INTERNAL_ERROR
  };

  // Add validation errors if available
  if (error instanceof ValidationError && error.errors) {
    errorResponse.errors = error.errors;
  }

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  const statusCode = error.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 - Not Found
 */
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, STATUS_CODE.NOT_FOUND);
  next(error);
};