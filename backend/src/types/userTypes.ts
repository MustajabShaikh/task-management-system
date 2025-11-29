import { Document, Types } from 'mongoose';
import { UserRole } from './enums.js';

/**
 * User Interface
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(actualPassword: string): Promise<boolean>;
}

/**
 * User Registration Data
 */
export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * User Login Data
 */
export interface IUserLogin {
  email: string;
  password: string;
}

/**
 * JWT Payload
 */
export interface IJWTPayload {
  id: string;
  email: string;
  role: UserRole;
}