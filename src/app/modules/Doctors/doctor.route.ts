import express from 'express';
import { DoctorControllers } from './doctor.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';

const router = express.Router();

// Example routes with optional auth
router.post('/', auth(USER_ROLES.ADMIN), DoctorControllers.createDoctor);
router.get(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  DoctorControllers.getAllDoctors,
);
router.get(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  DoctorControllers.getDoctorById,
);
router.get(
  '/special_doctor',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  DoctorControllers.getSpecialDoctor,
);
router.patch('/:id', auth(USER_ROLES.ADMIN), DoctorControllers.updateDoctor);
router.delete('/:id', auth(USER_ROLES.ADMIN), DoctorControllers.deleteDoctor);

export const DoctorRoutes = router;
