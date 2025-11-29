import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types/userTypes';

export const generateToken = (payload: IJWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE_TIME || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env');
  }

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): IJWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env');
  }

  try {
    const decoded = jwt.verify(token, secret) as IJWTPayload;
    return decoded;
  } catch (error) {
    throw error;
  }
};