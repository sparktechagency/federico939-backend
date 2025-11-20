import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import { NotificationControllers } from './notification.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.USER),
  NotificationControllers.userNotification,
);
router.get(
  '/admin',
  auth(USER_ROLES.SUPER_ADMIN),
  NotificationControllers.adminNotification,
);
router.patch(
  '/',
  auth(USER_ROLES.USER),
  NotificationControllers.userReadNotification,
);
router.patch(
  '/admin',
  auth(USER_ROLES.USER),
  NotificationControllers.adminReadNotification,
);

export const NotificationRoutes = router;
