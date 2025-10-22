import express from 'express';
import { DoctorControllers } from './doctor.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// Example routes with optional auth
router.post('/', auth(USER_ROLE.admin), DoctorControllers.createDoctor);
router.get(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  DoctorControllers.getAllDoctors,
);
router.get(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.admin),
  DoctorControllers.getDoctorById,
);
router.get(
  '/special_doctor',
  auth(USER_ROLE.user, USER_ROLE.admin),
  DoctorControllers.getSpecialDoctor,
);
router.patch('/:id', auth(USER_ROLE.admin), DoctorControllers.updateDoctor);
router.delete('/:id', auth(USER_ROLE.admin), DoctorControllers.deleteDoctor);

export const DoctorRoutes = router;
