import express from 'express';
import { getUsers } from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../types/enums.js';

const router = express.Router();

router.get('/', protect, authorize(UserRole.ADMIN, UserRole.MANAGER), getUsers);

export default router;