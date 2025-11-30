import { useEffect } from 'react';
import { useSocket } from '@/contexts';
import { toast } from 'react-toastify';
import {
  ISocketTaskCreatedData,
  ISocketTaskUpdatedData,
  ISocketTaskDeletedData,
  ISocketTaskAssignedData,
  ISocketTaskStatusChangedData,
} from '@/types';
import { getStatusLabel } from '@/types/enums';

interface SocketEventHandlers {
  onTaskCreated?: (data: ISocketTaskCreatedData) => void;
  onTaskUpdated?: (data: ISocketTaskUpdatedData) => void;
  onTaskDeleted?: (data: ISocketTaskDeletedData) => void;
  onTaskAssigned?: (data: ISocketTaskAssignedData) => void;
  onTaskStatusChanged?: (data: ISocketTaskStatusChangedData) => void;
  showNotifications?: boolean;
}

export const useSocketEvents = (handlers: SocketEventHandlers): void => {
  const {
    onTaskCreated: socketOnTaskCreated,
    onTaskUpdated: socketOnTaskUpdated,
    onTaskDeleted: socketOnTaskDeleted,
    onTaskAssigned: socketOnTaskAssigned,
    onTaskStatusChanged: socketOnTaskStatusChanged,
    offTaskCreated,
    offTaskUpdated,
    offTaskDeleted,
    offTaskAssigned,
    offTaskStatusChanged,
    isConnected,
  } = useSocket();

  const { showNotifications = true } = handlers;

  useEffect(() => {
    if (!isConnected) return;

    const handleTaskCreated = (data: ISocketTaskCreatedData) => {
      if (showNotifications) {
        toast.info(`New task created: ${data.data.title}`);
      }
      
      if (handlers.onTaskCreated) {
        handlers.onTaskCreated(data);
      }
    };

    const handleTaskUpdated = (data: ISocketTaskUpdatedData) => {
      if (showNotifications) {
        toast.info(`Task updated: ${data.data.title}`);
      }
      
      if (handlers.onTaskUpdated) {
        handlers.onTaskUpdated(data);
      }
    };

    const handleTaskDeleted = (data: ISocketTaskDeletedData) => {
      if (showNotifications) {
        toast.warning('A task was deleted');
      }
      
      if (handlers.onTaskDeleted) {
        handlers.onTaskDeleted(data);
      }
    };

    const handleTaskAssigned = (data: ISocketTaskAssignedData) => {
      if (showNotifications) {
        toast.success(`Task assigned to you: ${data.data.title}`);
      }
      
      if (handlers.onTaskAssigned) {
        handlers.onTaskAssigned(data);
      }
    };

    const handleTaskStatusChanged = (data: ISocketTaskStatusChangedData) => {
      if (showNotifications) {
        const oldStatus = getStatusLabel(data.data.oldStatus);
        const newStatus = getStatusLabel(data.data.newStatus);
        toast.info(`Task status changed: ${oldStatus} → ${newStatus}`);
      }
      
      if (handlers.onTaskStatusChanged) {
        handlers.onTaskStatusChanged(data);
      }
    };

    if (handlers.onTaskCreated) {
      socketOnTaskCreated(handleTaskCreated);
    }
    if (handlers.onTaskUpdated) {
      socketOnTaskUpdated(handleTaskUpdated);
    }
    if (handlers.onTaskDeleted) {
      socketOnTaskDeleted(handleTaskDeleted);
    }
    if (handlers.onTaskAssigned) {
      socketOnTaskAssigned(handleTaskAssigned);
    }
    if (handlers.onTaskStatusChanged) {
      socketOnTaskStatusChanged(handleTaskStatusChanged);
    }

    return () => {
      offTaskCreated(handleTaskCreated);
      offTaskUpdated(handleTaskUpdated);
      offTaskDeleted(handleTaskDeleted);
      offTaskAssigned(handleTaskAssigned);
      offTaskStatusChanged(handleTaskStatusChanged);
    };
  }, [
    isConnected,
    handlers.onTaskCreated,
    handlers.onTaskUpdated,
    handlers.onTaskDeleted,
    handlers.onTaskAssigned,
    handlers.onTaskStatusChanged,
    showNotifications,
  ]);
};