import { AxiosError } from 'axios';
import { IApiError } from '@/types';
import { toast } from 'react-toastify';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as IApiError;
    
    // If there are validation errors, return the first one
    if (apiError?.errors && apiError.errors.length > 0) {
      return apiError.errors[0].message;
    }
    
    // Return the main error message
    if (apiError?.message) {
      return apiError.message;
    }
    
    // Return generic message based on status code
    const status = error.response?.status ?? 0;

    if (status === 401) {
      return 'Authentication failed. Please login again.';
    }

    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (status === 404) {
      return 'Resource not found.';
    }

    if (status >= 500) {
      return 'Server error. Please try again later.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
};

export const handleApiError = (error: unknown, customMessage?: string): void => {
  const message = customMessage || getErrorMessage(error);
  toast.error(message);
  console.error('API Error:', error);
};

export const getValidationErrors = (error: unknown): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as IApiError;
    
    if (apiError?.errors) {
      apiError.errors.forEach((err) => {
        errors[err.field] = err.message;
      });
    }
  }
  
  return errors;
};