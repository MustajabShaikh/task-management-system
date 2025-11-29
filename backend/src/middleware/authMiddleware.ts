import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/expressTypes';
import { verifyToken } from '../utils/jwtUtils.js';
import { AuthenticationError, AuthorizationError } from '../types/errorTypes.js';
import User from '../models/userModel.js';
import { UserRole } from '../types/enums.js';
import { asyncHandler } from './asyncHandler.js';

/**
 * Protect routes - Require authentication
 */
export const protect = asyncHandler(
  async (req: AuthRequest, __res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AuthenticationError('Not authorized to access this route');
    }

    try {
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      throw new AuthenticationError('Not authorized to access this route');
    }
  }
);

/**
 * Authorize roles - Check if user has required role
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, __res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};