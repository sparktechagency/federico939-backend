import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';

// register user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Your account has been successfully created. Verify Your Email By OTP. Check your email',
      data: result,
    });
  },
);

// register admin
const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createAdminToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admin created successfully',
      data: result,
    });
  },
);

// retrieved user profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

// update profile
const updateProfile = catchAsync(async (req, res) => {
  const user: any = req.user;
  if ('role' in req.body) {
    delete req.body.role;
  }
  // If password is provided
  if (req.body.password) {
    req.body.password = await bcrypt.hash(
      req.body.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await UserService.updateProfileToDB(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users are retrieved successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User is retrieve successfully by user ID',
    data: result,
  });
});

const updateUserStatusById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await UserService.updateUserStatusByIdToDB(id, status);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User status is updated successfully',
    data: result,
  });
});

const deleteUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUserByIdFromD(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User is deleted successfully',
    data: result,
  });
});

const deleteProfile = catchAsync(async (req, res) => {
  const { id }: any = req.user;
 

  const result = await UserService.deleteProfileFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile deleted successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  createAdmin,
  getUserProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserStatusById,
  deleteUserById,
  deleteProfile,
};
