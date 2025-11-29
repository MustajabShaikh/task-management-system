import { Response } from 'express';
import { AuthRequest } from '../types/expressTypes';
import User from '../models/userModel';
import { IUserRegister, IUserLogin } from '../types/userTypes';
import { generateToken } from '../utils/jwtUtils';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ConflictError, AuthenticationError, NotFoundError } from '../types/errorTypes';
import { UserRole } from '../types/enums.js';

export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, email, password, role }: IUserRegister = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || UserRole.USER // Default is user role if not specified
    });

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });
  }
);

export const login = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email, password }: IUserLogin = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });
  }
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError('User not authenticated');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  }
);