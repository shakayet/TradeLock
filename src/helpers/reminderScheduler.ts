/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { Reminder } from '../app/modules/reminder/reminder.model';
import { IReminder } from '../app/modules/reminder/reminder.interface';
import { User } from '../app/modules/user/user.model';
import { emailHelper } from './emailHelper';
import { errorLogger, logger } from '../shared/logger';
import { emailTemplate } from '../shared/emailTemplate';

type TimeoutMap = Record<string, NodeJS.Timeout>;

const timeouts: TimeoutMap = {};
let initialized = false;

const schedule = (reminder: IReminder & { _id: any }) => {
  try {
    const id = reminder._id.toString();
    // Prevent duplicates
    cancel(id);

    // Skip scheduling if already notified or cancelled
    if (reminder.status !== 'scheduled' || !reminder.enabled) {
      return;
    }

    const now = Date.now();
    const notifyAtMs = new Date(reminder.notifyAt).getTime();
    const delay = notifyAtMs - now;

    if (delay <= 0) {
      // Send immediately if missed
      triggerNotification(id).catch(err =>
        errorLogger.error('Reminder immediate send failed', err),
      );
      return;
    }

    timeouts[id] = setTimeout(() => {
      triggerNotification(id).catch(err =>
        errorLogger.error('Reminder scheduled send failed', err),
      );
    }, delay);
  } catch (error) {
    errorLogger.error('Schedule reminder error', error);
  }
};

const reschedule = (reminder: IReminder & { _id: any }) => {
  schedule(reminder);
};

const cancel = (id: string) => {
  const t = timeouts[id];
  if (t) {
    clearTimeout(t);
    delete timeouts[id];
  }
};

const triggerNotification = async (id: string) => {
  const reminder = await Reminder.findById(id);
  if (!reminder) return;
  if (reminder.status !== 'scheduled' || !reminder.enabled) return;

  // Fetch user email
  const user = await User.findById(reminder.user);
  if (!user?.email) return;

  const startAtLocal = new Date(reminder.startAt).toLocaleString('en-GB', {
    timeZone: reminder.timezone || 'UTC',
    hour12: false,
  });
  const mail = emailTemplate.reminderNotification({
    email: user.email!,
    name: user.name,
    title: reminder.title,
    startAtLocal,
    timezone: reminder.timezone || 'UTC',
    description: reminder.description || '',
  });

  await emailHelper.sendEmail(mail as any);

  await Reminder.findByIdAndUpdate(id, {
    $set: { status: 'notified', notifiedAt: new Date() },
  });

  cancel(id);
};

const init = async () => {
  if (initialized) return;
  initialized = true;
  try {
    const upcoming = await Reminder.find({
      status: 'scheduled',
      notifyAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // within past 5 minutes or future
    });
    upcoming.forEach(r => schedule(r as any));
    logger.info(
      `Reminder scheduler initialized with ${upcoming.length} reminders`,
    );
    // Fallback poller to catch missed events (every minute)
    setInterval(async () => {
      const candidates = await Reminder.find({
        status: 'scheduled',
        notifyAt: { $lte: new Date() },
      }).limit(50);
      for (const r of candidates) {
        await triggerNotification(r._id.toString());
      }
    }, 60 * 1000);
  } catch (error) {
    errorLogger.error('Reminder scheduler init error', error);
  }
};

export const reminderScheduler = {
  init,
  schedule,
  reschedule,
  cancel,
};
