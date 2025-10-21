import express from 'express';

import { FaqController } from './faq.controller';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { FaqValidation } from './faq.validation';
import { USER_ROLE } from '../User/user.constant';
const router = express.Router();

router
  .route('/')
  .post(
    validateRequest(FaqValidation.createFaqZodSchema),
    auth(USER_ROLE.admin, USER_ROLE.user),
    FaqController.createFaq,
  )
  .get(FaqController.getFaqs);

router
  .route('/:id')
  .delete(auth(USER_ROLE.admin, USER_ROLE.user), FaqController.deleteFaq)
  .patch(auth(USER_ROLE.admin, USER_ROLE.user), FaqController.updateFaq);

export const FaqRoutes = router;
