import { IUser } from './user.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { User } from './user.model';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { STATUS } from './user.constant';
import AppError from '../../errors/AppError';
import generateOTP from '../../utils/generateOTP';
import { emailTemplate } from '../../shared/emailTemplate';
import { emailHelper } from '../../helpers/emailHelper';
import { jwtHelper } from '../../helpers/jwtHelper';
import config from '../../config';
import unlinkFile from '../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';

const createAdminToDB = async (payload: any): Promise<IUser> => {
  // check admin is exist or not;
  const isExistAdmin = await User.findOne({ email: payload.email });
  if (isExistAdmin) {
    throw new AppError(StatusCodes.CONFLICT, 'This Email already taken');
  }

  // create admin to db
  const createAdmin = await User.create(payload);
  if (!createAdmin) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
  } else {
    await User.findByIdAndUpdate(
      { _id: createAdmin?._id },
      { verified: true },
      { new: true },
    );
  }

  return createAdmin;
};

const createUserToDB = async (payload: any) => {
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };

  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };

  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } },
  );

  const createToken = jwtHelper.createToken(
    {
      id: createUser._id,
      email: createUser.email,
      role: createUser.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string,
  );

  const result = {
    token: createToken,
    user: createUser,
  };

  return result;
};

const getUserProfileFromDB = async (
  user: JwtPayload,
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.profileImage && isExistUser.profileImage) {
    unlinkFile(isExistUser.profileImage);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return updateDoc;
};

const getAllUsersFromDB = async (query: any) => {
  let baseQuery;

  // 🔥 If ?role=admin → exclude USER and SUPER_ADMIN
  if (query.role === "ADMIN") {
    baseQuery = User.find({
      $and: [
        { role: { $ne: "USER" } },
        { role: { $ne: "SUPER_ADMIN" } },
      ],
    });

    // remove role from query so QueryBuilder.filter() does NOT override it
    delete query.role;
  } else {
    baseQuery = User.find();
  }

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(["name", "email"])
    .sort()
    .fields()
    .filter()
    .paginate();

  const users = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  if (!users || users.length === 0) {
    throw new AppError(404, "No users are found in the database");
  }

  return {
    data: users,
    meta,
  };
};

const getUserByIdFromDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(404, 'No user is found ');
  }
  return result;
};

const updateUserStatusByIdToDB = async (
  id: string,
  status: STATUS.ACTIVE | STATUS.INACTIVE,
) => {
  if (![STATUS.ACTIVE, STATUS.INACTIVE].includes(status)) {
    throw new AppError(400, "Status must be either 'ACTIVE' or 'INACTIVE'");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'No user is found by this user ID');
  }

  const result = await User.findByIdAndUpdate(id, { status }, { new: true });
  if (!result) {
    throw new AppError(400, 'Failed to change status by this user ID');
  }

  return result;
};

const deleteUserByIdFromD = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'User doest not exist in the database');
  }

  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete user by this ID');
  }

  return result;
};

const deleteProfileFromDB = async (id: string) => {
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete this user');
  }
  return result;
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  createAdminToDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserStatusByIdToDB,
  deleteUserByIdFromD,
  deleteProfileFromDB,
};
