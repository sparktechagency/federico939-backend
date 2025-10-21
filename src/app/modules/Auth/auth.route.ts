import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);
router.post(
  '/register',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'profileImg', maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.registerUser,
);

router.post(
  '/otp-compare-for-register',
  // validateRequest(AuthValidation.compareOTPValidationSchema),
  AuthControllers.compareOTPForRegister,
);

router.patch(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.post('/reset-password', AuthControllers.resetPassword);

router.post(
  '/otp-compare-for-reset-password',
  validateRequest(AuthValidation.compareOTPValidationSchema),
  AuthControllers.compareOTPForPasswordReset,
);

router.post('/otp-resend/:email', AuthControllers.resendOTP);

export const AuthRoutes = router;
