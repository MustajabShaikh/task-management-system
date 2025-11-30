import axiosInstance from './axiosConfig';
import { IUser } from '@/types';

export const userApi = {
  getUsers: async (): Promise<{ success: boolean; data: { users: IUser[] } }> => {
    const response = await axiosInstance.get<{ success: boolean; data: { users: IUser[] } }>('/users');
    return response.data;
  },
};