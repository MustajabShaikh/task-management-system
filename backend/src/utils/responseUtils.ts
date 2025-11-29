import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export const sendResponse = <T = any>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
): void => {
  const response: ApiResponse<T> = {
    success,
    statusCode,
    message
  };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

export const sendSuccess = <T = any>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void => {
  sendResponse(res, statusCode, true, message, data);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any[]
): void => {
  const response: any = {
    success: false,
    statusCode,
    message
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};