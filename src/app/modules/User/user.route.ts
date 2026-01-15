import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import parseAllFilesData from '../../middlewares/parseAllFileData';
import { FOLDER_NAMES } from '../../enums/files';

const router = express.Router();

router
  .route('/profile')
  .get(
    auth(
      USER_ROLES.USER,
      USER_ROLES.AUDIO_ADMIN,
      USER_ROLES.BLOG_ADMIN,
      USER_ROLES.DOCTOR_ADMIN,
      USER_ROLES.SUPER_ADMIN,
    ),
    UserController.getUserProfile,
  )
  .delete(
    auth(
      USER_ROLES.USER,
      USER_ROLES.AUDIO_ADMIN,
      USER_ROLES.BLOG_ADMIN,
      USER_ROLES.DOCTOR_ADMIN,
    ),
    UserController.deleteAccount,
  );

router.post(
  '/create-admin',
  validateRequest(UserValidation.createAdminZodSchema),
  UserController.createAdmin,
);

router
  .route('/')
  .post(UserController.createUser)
  .patch(
    auth(
      USER_ROLES.USER,
      USER_ROLES.AUDIO_ADMIN,
      USER_ROLES.BLOG_ADMIN,
      USER_ROLES.DOCTOR_ADMIN,
      USER_ROLES.SUPER_ADMIN,
    ),
    fileUploadHandler(),
    parseAllFilesData({
      fieldName: FOLDER_NAMES.PROFILE_IMAGE,
      forceSingle: true,
    }),
    UserController.updateProfile,
  )
  .get(auth(USER_ROLES.SUPER_ADMIN), UserController.getAllUsers);

router
  .route('/:id')
  .get(auth(USER_ROLES.SUPER_ADMIN), UserController.getUserById)
  .delete(auth(USER_ROLES.SUPER_ADMIN), UserController.deleteUserById);

router.patch(
  '/:id/status',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.updateUserStatusById,
);

export const UserRoutes = router;
