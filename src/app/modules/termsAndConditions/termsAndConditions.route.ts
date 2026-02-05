import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TermsAndConditionsController } from './termsAndConditions.controller';
import { TermsAndConditionsValidation } from './termsAndConditions.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(TermsAndConditionsValidation.createTermsAndConditionsZodSchema),
    TermsAndConditionsController.createTermsAndConditions
  )
  .get(TermsAndConditionsController.getTermsAndConditions);

router
  .route('/:id')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(TermsAndConditionsValidation.updateTermsAndConditionsZodSchema),
    TermsAndConditionsController.updateTermsAndConditions
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    TermsAndConditionsController.deleteTermsAndConditions
  );

export const TermsAndConditionsRoutes = router;
