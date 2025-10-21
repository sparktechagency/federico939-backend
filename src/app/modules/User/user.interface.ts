/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TRegisterUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  profileImg?: string;
  NIDnumber: string;
  NIDOrPassportImg: string;
}

export interface TUser {
  _id: Types.ObjectId;
  name: string;
  id: string;
  email: string;
  phone: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'user' | 'admin';
  status: 'in-progress' | 'banned';
  isDeleted: boolean;
  profileImg: string;
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByObjectId(_id: string): Promise<TUser | null>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
