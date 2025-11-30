import axiosInstance from './axiosConfig';
import { IUser, IUserProfileResponse } from '@/types';

export const userApi = {
  getUsers: async (): Promise<{ success: boolean; data: { users: IUser[] } }> => {
    const response = await axiosInstance.get<{ success: boolean; data: { users: IUser[] } }>('/users');
    return response.data;
  },
  getUserProfile: async (id: string): Promise<IUserProfileResponse> => {
    const response = await axiosInstance.get<IUserProfileResponse>(`/users/${id}`);
    return response.data;
  },
  updateProfile: async (id: string, data: { name: string }): Promise<IUserProfileResponse> => {
    const response = await axiosInstance.put<IUserProfileResponse>(`/users/${id}`, data);
    return response.data;
  },
};