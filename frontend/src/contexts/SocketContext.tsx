import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/constants';
import {
  SOCKET_EVENTS,
  ISocketTaskCreatedData,
  ISocketTaskUpdatedData,
  ISocketTaskDeletedData,
  ISocketTaskAssignedData,
  ISocketTaskStatusChangedData,
} from '@/types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onTaskCreated: (callback: (data: ISocketTaskCreatedData) => void) => void;
  onTaskUpdated: (callback: (data: ISocketTaskUpdatedData) => void) => void;
  onTaskDeleted: (callback: (data: ISocketTaskDeletedData) => void) => void;
  onTaskAssigned: (callback: (data: ISocketTaskAssignedData) => void) => void;
  onTaskStatusChanged: (callback: (data: ISocketTaskStatusChangedData) => void) => void;
  offTaskCreated: (callback: (data: ISocketTaskCreatedData) => void) => void;
  offTaskUpdated: (callback: (data: ISocketTaskUpdatedData) => void) => void;
  offTaskDeleted: (callback: (data: ISocketTaskDeletedData) => void) => void;
  offTaskAssigned: (callback: (data: ISocketTaskAssignedData) => void) => void;
  offTaskStatusChanged: (callback: (data: ISocketTaskStatusChangedData) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      return;
    }

    // Create socket connection
    const newSocket = io(API_CONFIG.SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error('Real-time connection error');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const onTaskCreated = (callback: (data: ISocketTaskCreatedData) => void): void => {
    if (socket) {
      socket.on(SOCKET_EVENTS.TASK_CREATED, callback);
    }
  };

  const onTaskUpdated = (callback: (data: ISocketTaskUpdatedData) => void): void => {
    if (socket) {
      socket.on(SOCKET_EVENTS.TASK_UPDATED, callback);
    }
  };

  const onTaskDeleted = (callback: (data: ISocketTaskDeletedData) => void): void => {
    if (socket) {
      socket.on(SOCKET_EVENTS.TASK_DELETED, callback);
    }
  };

  const onTaskAssigned = (callback: (data: ISocketTaskAssignedData) => void): void => {
    if (socket) {
      socket.on(SOCKET_EVENTS.TASK_ASSIGNED, callback);
    }
  };

  const onTaskStatusChanged = (callback: (data: ISocketTaskStatusChangedData) => void): void => {
    if (socket) {
      socket.on(SOCKET_EVENTS.TASK_STATUS_CHANGED, callback);
    }
  };

  const offTaskCreated = (callback: (data: ISocketTaskCreatedData) => void): void => {
    if (socket) {
      socket.off(SOCKET_EVENTS.TASK_CREATED, callback);
    }
  };

  const offTaskUpdated = (callback: (data: ISocketTaskUpdatedData) => void): void => {
    if (socket) {
      socket.off(SOCKET_EVENTS.TASK_UPDATED, callback);
    }
  };

  const offTaskDeleted = (callback: (data: ISocketTaskDeletedData) => void): void => {
    if (socket) {
      socket.off(SOCKET_EVENTS.TASK_DELETED, callback);
    }
  };

  const offTaskAssigned = (callback: (data: ISocketTaskAssignedData) => void): void => {
    if (socket) {
      socket.off(SOCKET_EVENTS.TASK_ASSIGNED, callback);
    }
  };

  const offTaskStatusChanged = (callback: (data: ISocketTaskStatusChangedData) => void): void => {
    if (socket) {
      socket.off(SOCKET_EVENTS.TASK_STATUS_CHANGED, callback);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onTaskAssigned,
    onTaskStatusChanged,
    offTaskCreated,
    offTaskUpdated,
    offTaskDeleted,
    offTaskAssigned,
    offTaskStatusChanged,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};