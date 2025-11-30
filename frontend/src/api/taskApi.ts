import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@/constants/constants';
import {
  ITaskCreate,
  ITaskUpdate,
  ITaskFilters,
  ITaskListResponse,
  ITaskResponse,
  ITaskStatsResponse,
  ITaskDeleteResponse,
} from '@/types';

export const taskApi = {
  getTasks: async (filters?: ITaskFilters): Promise<ITaskListResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status !== undefined) params.append('status', filters.status.toString());
      if (filters.priority !== undefined) params.append('priority', filters.priority.toString());
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.createdBy) params.append('createdBy', filters.createdBy);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }
    
    const response = await axiosInstance.get<ITaskListResponse>(
      `${API_ENDPOINTS.TASKS.BASE}${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  },
  getTaskById: async (id: string): Promise<ITaskResponse> => {
    const response = await axiosInstance.get<ITaskResponse>(
      API_ENDPOINTS.TASKS.BY_ID(id)
    );
    return response.data;
  },
  createTask: async (data: ITaskCreate): Promise<ITaskResponse> => {
    const response = await axiosInstance.post<ITaskResponse>(
      API_ENDPOINTS.TASKS.BASE,
      data
    );
    return response.data;
  },
  updateTask: async (id: string, data: ITaskUpdate): Promise<ITaskResponse> => {
    const response = await axiosInstance.put<ITaskResponse>(
      API_ENDPOINTS.TASKS.BY_ID(id),
      data
    );
    return response.data;
  },
  deleteTask: async (id: string): Promise<ITaskDeleteResponse> => {
    const response = await axiosInstance.delete<ITaskDeleteResponse>(
      API_ENDPOINTS.TASKS.BY_ID(id)
    );
    return response.data;
  },
  getTaskStats: async (): Promise<ITaskStatsResponse> => {
    const response = await axiosInstance.get<ITaskStatsResponse>(
      API_ENDPOINTS.TASKS.STATS
    );
    return response.data;
  },
};