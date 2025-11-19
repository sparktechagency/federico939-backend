import express from 'express';
import { DoctorControllers } from './doctor.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import parseAllFilesData from '../../middlewares/parseAllFileData';
import { FOLDER_NAMES } from '../../enums/files';

const router = express.Router();

// Example routes with optional auth
router.post(
  '/',
  fileUploadHandler(),
  parseAllFilesData({ fieldName: FOLDER_NAMES.IMAGE, forceSingle: true }),
  auth(USER_ROLES.DOCTOR_ADMIN, USER_ROLES.SUPER_ADMIN),
  DoctorControllers.createDoctor,
);
router.get(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.AUDIO_ADMIN, USER_ROLES.BLOG_ADMIN, USER_ROLES.DOCTOR_ADMIN, USER_ROLES.SUPER_ADMIN),
  DoctorControllers.getAllDoctors,
);
router.get(
  '/special_doctor',
  auth(USER_ROLES.USER, USER_ROLES.AUDIO_ADMIN, USER_ROLES.BLOG_ADMIN, USER_ROLES.DOCTOR_ADMIN, USER_ROLES.SUPER_ADMIN),
  DoctorControllers.getSpecialDoctor,
);
router.get(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.AUDIO_ADMIN, USER_ROLES.BLOG_ADMIN, USER_ROLES.DOCTOR_ADMIN, USER_ROLES.SUPER_ADMIN),
  DoctorControllers.getDoctorById,
);
router.patch(
  '/:id',
  fileUploadHandler(),
  parseAllFilesData({ fieldName: FOLDER_NAMES.IMAGE, forceSingle: true }),
  auth(USER_ROLES.DOCTOR_ADMIN, USER_ROLES.SUPER_ADMIN),
  DoctorControllers.updateDoctor,
);
router.delete(
  '/:id',
  auth(USER_ROLES.DOCTOR_ADMIN, USER_ROLES.SUPER_ADMIN),
  DoctorControllers.deleteDoctor,
);

export const DoctorRoutes = router;
