import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/dbconfig';
import { initializeSocket } from './config/socket';
import { errorHandler, notFound } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Routes
app.use('/api/auth', authRoutes);

// Task Routes
app.use('/api/tasks', taskRoutes);

// User Routes
app.use('/api/users', userRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize Socket.io
    initializeSocket(server);

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();