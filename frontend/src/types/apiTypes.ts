export interface IApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface IApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  stack?: string;
}

export interface IAxiosError {
  response?: {
    data: IApiError;
    status: number;
    statusText: string;
  };
  message: string;
}