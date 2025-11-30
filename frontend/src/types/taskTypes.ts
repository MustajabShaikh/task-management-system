import { TaskStatus, TaskPriority } from './enums';
import { IUser } from './userTypes';

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
  assignedTo?: IUser | string;
  createdBy: IUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface ITaskCreate {
  title: string;
  description: string;
  status?: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags?: string[];
  assignedTo?: string;
}

export interface ITaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
}

export interface ITaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  createdBy?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ITaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  onHold: number;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ITaskListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    tasks: ITask[];
    pagination: IPagination;
  };
}

export interface ITaskResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    task: ITask;
  };
}

export interface ITaskStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    stats: ITaskStats;
  };
}

export interface ITaskDeleteResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    taskId: string;
  };
}