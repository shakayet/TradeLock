import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

router.get(
  '/target/:targetUserId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TRADE_MAN, USER_ROLES.COMPANY),
  ReviewController.getReviewsForTarget
);

export const ReviewRoutes = router;
