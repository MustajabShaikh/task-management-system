import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { registerValidation, loginValidation } from '../validators/authValidator';
import { validate } from '../middleware/validateMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerValidation, validate, register);

router.post('/login', loginValidation, validate, login);

router.get('/me', protect, getMe);

export default router;