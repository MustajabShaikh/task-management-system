import { UserRole } from './enums';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: IUser;
    token: string;
  };
}

export interface IUserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: IUser;
  };
}