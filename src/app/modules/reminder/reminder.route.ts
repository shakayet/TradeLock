import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReminderValidation } from './reminder.validation';
import { ReminderController } from './reminder.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ReminderValidation.createReminderZodSchema),
  ReminderController.createReminder,
);

router.get(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ReminderController.getMyReminders,
);

router.patch(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ReminderValidation.reminderIdParamsZodSchema),
  validateRequest(ReminderValidation.updateReminderZodSchema),
  ReminderController.updateReminder,
);

router.delete(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ReminderValidation.reminderIdParamsZodSchema),
  ReminderController.deleteReminder,
);

router.patch(
  '/:id/toggle',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ReminderValidation.reminderIdParamsZodSchema),
  validateRequest(ReminderValidation.toggleReminderZodSchema),
  ReminderController.toggleReminder,
);

export const ReminderRoutes = router;
