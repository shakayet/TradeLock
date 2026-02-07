/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  contact: string;
  email: string;
  password: string;
  role: USER_ROLES;
  location?: string;
  country?: string;
  trade_type?: string;
  image?: string;
  DOB?: string;
  status: 'active' | 'delete';
  verified: boolean;
  provider?: 'local' | 'google' | 'facebook' | 'github';
  providerId?: string;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  deleteAccount(id: string): any;
  isMatchPassword(password: string, hashPassword: string): Promise<boolean>;
} & Model<IUser>;
