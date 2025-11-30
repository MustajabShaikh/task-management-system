import { Response } from 'express';
import { AuthRequest } from '../types/expressTypes';
import User from '../models/userModel';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { STATUS_CODE } from '../constants/constants.js';
import { sendSuccess } from '../utils/responseUtils';
import { UserRole } from '../types/enums.js';

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