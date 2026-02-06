import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { PersonalChatController } from './personalChat.controller';
import { PersonalChatValidation } from './personalChat.validation';

const router = express.Router();

router.post(
  '/conversation',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(PersonalChatValidation.createConversationZodSchema),
  PersonalChatController.createOrGetConversation
);

router.get(
  '/conversations',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  PersonalChatController.getMyConversations
);

router.post(
  '/send-message',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = PersonalChatValidation.sendMessageZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return PersonalChatController.sendMessage(req, res, next);
  }
);

router.get(
  '/messages/:conversationId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  PersonalChatController.getMessages
);

router.patch(
  '/mark-as-read/:conversationId',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  PersonalChatController.markAsRead
);

export const PersonalChatRoutes = router;
