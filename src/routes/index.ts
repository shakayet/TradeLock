import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { OAuthRoutes } from '../app/modules/passport/oauth.route';
import { ChatRoutes } from '../app/modules/chat/chat.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { TermsAndConditionsRoutes } from '../app/modules/termsAndConditions/termsAndConditions.route';
import { PersonalChatRoutes } from '../app/modules/personalChat/personalChat.route';
import { JobsRoutes } from '../app/modules/jobs/job.route';
import { ReminderRoutes } from '../app/modules/reminder/reminder.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/oauth',
    route: OAuthRoutes,
  },
  {
    path: '/chat',
    route: ChatRoutes,
  },
  {
    path: '/faq',
    route: FaqRoutes,
  },
  {
    path: '/terms-and-conditions',
    route: TermsAndConditionsRoutes,
  },
  {
    path: '/personal-chat',
    route: PersonalChatRoutes,
  },
  {
    path: '/jobs',
    route: JobsRoutes,
  },
  {
    path: '/reminders',
    route: ReminderRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
