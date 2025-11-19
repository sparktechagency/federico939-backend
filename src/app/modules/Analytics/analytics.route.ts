import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import { AnalyticsControllers } from './analytics.controller';

const router = express.Router();

router.get(
  '/stats',
  auth(USER_ROLES.SUPER_ADMIN),
  AnalyticsControllers.getStats,
);

router.get(
  '/monthly-stats',
  auth(USER_ROLES.SUPER_ADMIN),
  AnalyticsControllers.getMonthlyUserStats,
);

export const AnalyticsRoutes = router;
