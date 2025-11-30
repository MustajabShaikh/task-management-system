import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import moment from 'moment';
import { verifyToken } from '../utils/jwtUtils';
import { IJWTPayload } from '../types/userTypes';
import { SOCKET_EVENTS } from '../constants/constants';
import { Types } from 'mongoose';

let io: SocketIOServer;

interface AuthenticatedSocket extends Socket {
  user?: IJWTPayload;
}

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }

      const decoded = verifyToken(token);
      socket.user = decoded;
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.email}`);

    // Join user to their own room for targeted messages
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
      console.log(`User ${socket.user.email} joined room: user:${socket.user.id}`);
    }

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`User disconnected: ${socket.user?.email}`);
    });

    socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
};

export const emitTaskCreated = (task: any) => {
  const io = getIO();
  
  // Broadcast to all connected users
  io.emit(SOCKET_EVENTS.TASK_CREATED, {
    event: 'task_created',
    data: task,
    timestamp: moment().toISOString()
  });

  // If task is assigned, send targeted notification
  if (task.assignedTo) {
    io.to(`user:${task.assignedTo._id || task.assignedTo}`).emit(SOCKET_EVENTS.TASK_ASSIGNED, {
      event: 'task_assigned',
      data: task,
      timestamp: moment().toISOString()
    });
  }
};

export const emitTaskUpdated = (task: any, updatedBy: Types.ObjectId) => {
  const io = getIO();
  
  io.emit(SOCKET_EVENTS.TASK_UPDATED, {
    event: 'task_updated',
    data: task,
    updatedBy,
    timestamp: moment().toISOString()
  });

  // Send to task creator
  if (task.createdBy) {
    io.to(`user:${task.createdBy._id || task.createdBy}`).emit(SOCKET_EVENTS.TASK_UPDATED, {
      event: 'task_updated',
      data: task,
      updatedBy,
      timestamp: moment().toISOString()
    });
  }

  // Send to assigned user
  if (task.assignedTo) {
    io.to(`user:${task.assignedTo._id || task.assignedTo}`).emit(SOCKET_EVENTS.TASK_UPDATED, {
      event: 'task_updated',
      data: task,
      updatedBy,
      timestamp: moment().toISOString()
    });
  }
};

export const emitTaskStatusChanged = (task: any, oldStatus: number, newStatus: number, updatedBy: Types.ObjectId) => {
  const io = getIO();
  
  io.emit(SOCKET_EVENTS.TASK_STATUS_CHANGED, {
    event: 'task_status_changed',
    data: {
      task,
      oldStatus,
      newStatus
    },
    updatedBy,
    timestamp: moment().toISOString()
  });
};

export const emitTaskDeleted = (taskId: string, deletedBy: Types.ObjectId) => {
  const io = getIO();
  
  io.emit(SOCKET_EVENTS.TASK_DELETED, {
    event: 'task_deleted',
    data: {
      taskId
    },
    deletedBy,
    timestamp: moment().toISOString()
  });
};