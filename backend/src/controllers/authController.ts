import { Response } from 'express';
import { AuthRequest } from '../types/expressTypes';
import User from '../models/userModel';
import { IUserRegister, IUserLogin } from '../types/userTypes';
import { generateToken } from '../utils/jwtUtils';
import { sendSuccess } from '../utils/responseUtils';
import { asyncHandler } from '../middleware/asyncHandler';
import { ConflictError, AuthenticationError, NotFoundError } from '../types/errorTypes';
import { UserRole } from '../types/enums';
import { STATUS_CODE, AUTH_MESSAGES } from '../constants/constants';

export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, email, password, role }: IUserRegister = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError(AUTH_MESSAGES.USER_EXISTS);
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

    sendSuccess(res, STATUS_CODE.CREATED, AUTH_MESSAGES.REGISTER_SUCCESS, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });
  }
);

export const login = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email, password }: IUserLogin = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthenticationError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new AuthenticationError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    sendSuccess(res, STATUS_CODE.OK, AUTH_MESSAGES.LOGIN_SUCCESS, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });
  }
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError(AUTH_MESSAGES.NOT_AUTHENTICATED);
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    sendSuccess(res, STATUS_CODE.OK, AUTH_MESSAGES.PROFILE_RETRIEVED, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  }
);