import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FaqController } from './faq.controller';
import { FaqValidation } from './faq.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(FaqValidation.createFaqZodSchema),
    FaqController.createFaq
  )
  .get(FaqController.getAllFaq);

router
  .route('/:id')
  .get(FaqController.getSingleFaq)
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(FaqValidation.updateFaqZodSchema),
    FaqController.updateFaq
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    FaqController.deleteFaq
  );

export const FaqRoutes = router;
