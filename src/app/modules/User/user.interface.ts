import { Model } from 'mongoose';
import { USER_ROLES } from '../../enums/user';
import { GENDER, STATUS } from './user.constant';

export type IUser = {
  name: string;
  role: USER_ROLES;
  email: string;
  password: string;
  dateOfBirth?: string;
  countryCode?: string;
  phone?: string;

  profileImage?: string;
  gender?: GENDER;

  status: STATUS;

  // authentication
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModel = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isExistUserByPhone(contact: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
