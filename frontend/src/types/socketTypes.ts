import { ITask } from './taskTypes';

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_ASSIGNED: 'task:assigned',
  TASK_STATUS_CHANGED: 'task:status_changed',
  ERROR: 'error'
} as const;

export interface ISocketTaskCreatedData {
  event: 'task_created';
  data: ITask;
  timestamp: string;
}

export interface ISocketTaskUpdatedData {
  event: 'task_updated';
  data: ITask;
  updatedBy: string;
  timestamp: string;
}

export interface ISocketTaskStatusChangedData {
  event: 'task_status_changed';
  data: {
    task: ITask;
    oldStatus: number;
    newStatus: number;
  };
  updatedBy: string;
  timestamp: string;
}

export interface ISocketTaskDeletedData {
  event: 'task_deleted';
  data: {
    taskId: string;
  };
  deletedBy: string;
  timestamp: string;
}

export interface ISocketTaskAssignedData {
  event: 'task_assigned';
  data: ITask;
  timestamp: string;
}