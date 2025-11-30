import express from 'express';
import { getUsers, getUserProfile, updateProfile } from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../types/enums.js';

const router = express.Router();

router.get('/', protect, authorize(UserRole.ADMIN, UserRole.MANAGER), getUsers);

router.get('/:id', protect, getUserProfile);

router.put('/:id', protect, updateProfile);

export default router;