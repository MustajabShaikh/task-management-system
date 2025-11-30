import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@/constants/constants';
import {
  IUserRegister,
  IUserLogin,
  IAuthResponse,
  IUserProfileResponse,
} from '@/types';

export const authApi = {
  register: async (data: IUserRegister): Promise<IAuthResponse> => {
    const response = await axiosInstance.post<IAuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },
  login: async (data: IUserLogin): Promise<IAuthResponse> => {
    const response = await axiosInstance.post<IAuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },
  getProfile: async (): Promise<IUserProfileResponse> => {
    const response = await axiosInstance.get<IUserProfileResponse>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data;
  },
};