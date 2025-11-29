import { Request } from 'express';
import { IUser } from './userTypes';

// Include user property to request
export interface AuthRequest extends Request {
  user?: IUser;
}