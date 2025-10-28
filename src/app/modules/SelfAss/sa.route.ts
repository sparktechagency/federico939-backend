import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import { SelfAssController } from './sa.controller';

const router = express.Router();

router.get(
  '/categories',
  //   auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  SelfAssController.getCategories,
);

router.get(
  '/:category',
  //   auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  SelfAssController.getQuestions,
);
router.post(
  '/:category/submit',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  SelfAssController.submitAssessment,
);
router.get(
  '/history/list',
  //   auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  SelfAssController.getHistory,
);

export const SelfAssRoutes = router;
