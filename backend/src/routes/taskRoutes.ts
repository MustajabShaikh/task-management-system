import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  taskQueryValidation
} from '../validators/taskValidator';
import { validate } from '../middleware/validateMiddleware';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../types/enums';

const router = express.Router();

router.get('/stats', protect, getTaskStats);

router.post('/', protect, authorize(UserRole.ADMIN, UserRole.MANAGER), createTaskValidation, validate, createTask);

router.get('/', protect, taskQueryValidation, validate, getTasks);

router.get('/:id', protect, taskIdValidation, validate, getTaskById);

router.put('/:id', protect, taskIdValidation, updateTaskValidation, validate, updateTask);

router.delete('/:id', protect, authorize(UserRole.ADMIN, UserRole.MANAGER), taskIdValidation, validate, deleteTask);

export default router;