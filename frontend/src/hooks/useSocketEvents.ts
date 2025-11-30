import { useEffect, useRef } from 'react';
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
  
  const shownNotifications = useRef(new Set<string>());

  useEffect(() => {
    if (!isConnected) return;

    // Task Created Handler
    const handleTaskCreated = (data: ISocketTaskCreatedData) => {
      const notificationKey = `created-${data.data._id}-${data.timestamp}`;
      if (showNotifications && !shownNotifications.current.has(notificationKey)) {
        toast.info(`New task created: ${data.data.title}`);
        shownNotifications.current.add(notificationKey);
        
        // Clean up old notifications after 5 seconds
        setTimeout(() => {
          shownNotifications.current.delete(notificationKey);
        }, 5000);
      }
      
      if (handlers.onTaskCreated) {
        handlers.onTaskCreated(data);
      }
    };

    // Task Updated Handler
    const handleTaskUpdated = (data: ISocketTaskUpdatedData) => {
      const notificationKey = `updated-${data.data._id}-${data.timestamp}`;
      if (showNotifications && !shownNotifications.current.has(notificationKey)) {
        toast.info(`Task updated: ${data.data.title}`);
        shownNotifications.current.add(notificationKey);
        
        setTimeout(() => {
          shownNotifications.current.delete(notificationKey);
        }, 5000);
      }
      
      if (handlers.onTaskUpdated) {
        handlers.onTaskUpdated(data);
      }
    };

    // Task Deleted Handler
    const handleTaskDeleted = (data: ISocketTaskDeletedData) => {
      const notificationKey = `deleted-${data.data.taskId}-${data.timestamp}`;
      if (showNotifications && !shownNotifications.current.has(notificationKey)) {
        toast.warning('A task was deleted');
        shownNotifications.current.add(notificationKey);
        
        setTimeout(() => {
          shownNotifications.current.delete(notificationKey);
        }, 5000);
      }
      
      if (handlers.onTaskDeleted) {
        handlers.onTaskDeleted(data);
      }
    };

    // Task Assigned Handler
    const handleTaskAssigned = (data: ISocketTaskAssignedData) => {
      const notificationKey = `assigned-${data.data._id}-${data.timestamp}`;
      if (showNotifications && !shownNotifications.current.has(notificationKey)) {
        toast.success(`Task assigned to you: ${data.data.title}`);
        shownNotifications.current.add(notificationKey);
        
        setTimeout(() => {
          shownNotifications.current.delete(notificationKey);
        }, 5000);
      }
      
      if (handlers.onTaskAssigned) {
        handlers.onTaskAssigned(data);
      }
    };

    // Task Status Changed Handler
    const handleTaskStatusChanged = (data: ISocketTaskStatusChangedData) => {
      const notificationKey = `status-${data.data.task._id}-${data.timestamp}`;
      if (showNotifications && !shownNotifications.current.has(notificationKey)) {
        const oldStatus = getStatusLabel(data.data.oldStatus);
        const newStatus = getStatusLabel(data.data.newStatus);
        toast.info(`Task status changed: ${oldStatus} → ${newStatus}`);
        shownNotifications.current.add(notificationKey);
        
        setTimeout(() => {
          shownNotifications.current.delete(notificationKey);
        }, 5000);
      }
      
      if (handlers.onTaskStatusChanged) {
        handlers.onTaskStatusChanged(data);
      }
    };

    // Subscribe to events
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

    // Cleanup - Unsubscribe from events
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