import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import { UserPromptControllers } from './userPrompt.controller';

const router = express.Router();

router.get(
  '/login-prompts',
  auth(USER_ROLES.USER),
  UserPromptControllers.checkPrompts,
);

router.patch(
  '/update-payment-interval',
  auth(USER_ROLES.USER),
  UserPromptControllers.updatePaymentInterval,
);

export const UserPromptRoutes = router;
