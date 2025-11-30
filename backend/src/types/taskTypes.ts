import { Document, Types } from 'mongoose';
import { TaskStatus, TaskPriority } from './enums';

/**
 * Task Interface
 */
export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  tags: string[];
  assignedTo?: Types.ObjectId | string;
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task Creation Data
 */
export interface ITaskCreate {
  title: string;
  description: string;
  status?: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  tags?: string[];
  assignedTo?: string;
}

/**
 * Task Update Data
 */
export interface ITaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  tags?: string[];
  assignedTo?: string;
}

/**
 * Task Query Filters
 */
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

/**
 * Task Statistics
 */
export interface ITaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  onHold: number;
}