import { Response } from 'express';
import { AuthRequest } from '../types/expressTypes';
import User from '../models/userModel';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { STATUS_CODE } from '../constants/constants.js';
import { sendSuccess } from '../utils/responseUtils';
import { UserRole } from '../types/enums.js';
import { NotFoundError, AuthorizationError } from '../types/errorTypes';

export const getUsers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const currentUser = req.user!;

    let query: any = {};

    if (currentUser.role === UserRole.ADMIN) {
      query.role = { $in: [UserRole.MANAGER, UserRole.USER] };
    } else if (currentUser.role === UserRole.MANAGER) {
      query.role = UserRole.USER;
    } else {
      // Regular users cannot access this endpoint
      return sendSuccess(res, STATUS_CODE.OK, 'Users retrieved successfully', { users: [] });
    }

    const users = await User.find(query).select('-password').sort({ name: 1 });

    sendSuccess(res, STATUS_CODE.OK, 'Users retrieved successfully', { users });
  }
);

export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id).select('name email role');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, STATUS_CODE.OK, 'User profile retrieved successfully', { user });
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const currentUser = req.user!;
    const { id } = req.params;
    const { name } = req.body;

    if (currentUser._id.toString() !== id) {
      throw new AuthorizationError('You can only update your own profile');
    }

    if (!name) {
      throw new Error('Name is required');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    ).select('name email role');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, STATUS_CODE.OK, 'Profile updated successfully', { user });
  }
);