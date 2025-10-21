/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import generateOTP from '../../utils/generateOTP';
import { TRegisterUser } from '../User/user.interface';
import { cleanObject } from '../User/user.utils';
import { OTP } from '../User/otp.model';
import { OTPmailBody, OTPmailSubject } from '../../utils/emailTemplate';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'banned') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is banned ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the  user

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const registerUser = async (payload: TRegisterUser, files: any) => {
  if (!payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields!');
  }

  if (!files || !files.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing NID document!');
  }
  // checking if the user is exist
  const userEmail = await User.findOne({ email: payload.email });
  const userPhone = await User.findOne({ phone: payload.phone });
  const userName = await User.findOne({ name: payload.name });

  let user = null;
  let duplicateField: string | null = null;

  // Step 1: Find duplicate
  if (userEmail) {
    user = userEmail;
    duplicateField = 'email';
  } else if (userPhone) {
    user = userPhone;
    duplicateField = 'phone';
  } else if (userName) {
    user = userName;
    duplicateField = 'username';
  }

  // Step 2: Run validations if user exists
  if (user) {
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
    }

    if (user?.status === 'banned') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is banned!');
    }

    // Step 3: If validations pass, throw duplication error
    if (duplicateField === 'email') {
      throw new AppError(httpStatus.CONFLICT, 'This email is already in use!');
    }
    if (duplicateField === 'phone') {
      throw new AppError(
        httpStatus.CONFLICT,
        'This phone number is already in use!',
      );
    }
    if (duplicateField === 'username') {
      throw new AppError(
        httpStatus.CONFLICT,
        'This username is already in use!',
      );
    }
  }

  // if (file && !payload.NIDOrPassportImg) {
  //   const filename = `/uploads/${file.filename}`;
  //   payload.NIDOrPassportImg = filename;
  // }

  if (files.profileImg) {
    const filename = `/uploads/${files.profileImg.filename}`;
    payload.profileImg = filename;
  }

  if (files.file) {
    const filename = `/uploads/${files.file.filename}`;
    payload.NIDOrPassportImg = filename;
  }

  const otp = generateOTP();

  const body = {
    email: payload.email,
    otp,
    expiresAt: new Date(Date.now() + 120000),
  };

  const storeOtpTOServer = await OTP.findOneAndUpdate(
    { email: payload.email },
    body,
    {
      upsert: true,
      new: true,
    },
  );

  if (!storeOtpTOServer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to store OTP !');
  }

  const html = OTPmailBody(otp);
  const subject = OTPmailSubject;

  sendEmail(payload?.email, html, subject);

  const crypto = config.create_user_otp_verify_token as string;
  // const crypto = cryptoToken(10);

  const token = jwt.sign(payload, crypto, { expiresIn: '2m' });

  return {
    token,
  };
};

const compareOTPForRegister = async (otp: string, token: string) => {
  if (!otp || !token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Missing OTP code or token!');
  }

  const decoded = verifyToken(
    token,
    config.create_user_otp_verify_token as string,
  );

  const userData = cleanObject(decoded, ['iat', 'exp']);

  const { email } = decoded;

  const isOtpExist = await OTP.findOne({ email });

  if (!isOtpExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'OTP code Expired! Please try again.!',
    );
  }
  if (isOtpExist.otp !== otp) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Incorrect OTP. Please try again.',
    );
  }

  const crypto = config.create_user_token as string;
  const createUserToken = jwt.sign(userData, crypto, { expiresIn: '2m' });

  return {
    token: createUserToken,
  };
};

const compareOTPForPasswordReset = async (otp: string, email: string) => {
  if (!otp || !email) {
    throw new AppError(httpStatus.NOT_FOUND, 'Missing OTP code or email!');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const isOtpExist = await OTP.findOne({ email });

  if (!isOtpExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'OTP code Expired! Please try again.!',
    );
  }
  if (isOtpExist.otp !== otp) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Incorrect OTP. Please try again.',
    );
  }

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };
  const secret = config.reset_pass_token;
  const token = createToken(jwtPayload, secret as string, '2m');
  return token;
};

const resendOTP = async (email: string) => {
  if (!email) {
    throw new AppError(httpStatus.NOT_FOUND, 'Missing user email!');
  }

  const newOtp = generateOTP();

  const html = OTPmailBody(newOtp);
  const subject = OTPmailSubject;

  const body = {
    email: email,
    otp: newOtp,
    expiresAt: new Date(Date.now() + 120000),
  };

  const isOtpExist = await OTP.findOne({ email });

  let storeOtpTOServer = null;

  if (isOtpExist) {
    storeOtpTOServer = await OTP.updateOne(
      { email },
      { otp: newOtp, expiresAt: new Date(Date.now() + 120000) },
    );
  } else {
    storeOtpTOServer = await OTP.create(body);
  }

  if (!storeOtpTOServer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to store OTP !');
  }
  sendEmail(email, html, subject);

  return null;
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.findById(userData.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'banned') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is banned ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.updateOne(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Update!');
  }

  return result;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByObjectId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'banned') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is banned ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'banned') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is banned ! !');
  }

  const otp = generateOTP();
  const html = OTPmailBody(otp);
  const subject = OTPmailSubject;

  const body = {
    email: user.email,
    otp,
    expiresAt: new Date(Date.now() + 120000),
  };
  const storeOtpTOServer = await OTP.create(body);
  if (!storeOtpTOServer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Failed to store OTP !');
  }
  sendEmail(user?.email, html, subject);

  return null;
};

const resetPassword = async (
  payload: { newPassword: string },
  token: string,
) => {
  let decoded: JwtPayload = {};
  try {
    decoded = jwt.verify(
      token,
      config.reset_pass_token as string,
    ) as JwtPayload;

    console.log('Decoded payload:', decoded);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Token has expired at: ${err.expiredAt}`,
      );
    } else if (err.name === 'JsonWebTokenError') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid token: ${err.message}`,
      );
    } else if (err.name === 'NotBeforeError') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Token not active yet: ${err.date}`,
      );
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Token verification failed: ${err}`,
      );
    }
  }

  // checking if the user is exist
  const user = await User.findOne({ _id: decoded.userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'banned') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is banned ! !');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
    },
  );

  //create token and sent to the  user

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  registerUser,
  compareOTPForRegister,
  compareOTPForPasswordReset,
  resendOTP,
};
