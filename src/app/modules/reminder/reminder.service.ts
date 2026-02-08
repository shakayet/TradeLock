/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Reminder } from './reminder.model';
import { IReminder } from './reminder.interface';
import { User } from '../user/user.model';
import { reminderScheduler } from '../../../helpers/reminderScheduler';

const createReminderToDB = async (
  user: JwtPayload,
  payload: Partial<IReminder>,
) => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!payload.title || !payload.startAt || !payload.endAt) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields');
  }

  const startAt = new Date(payload.startAt);
  const endAt = new Date(payload.endAt);
  if (endAt <= startAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'End time must be later than start time',
    );
  }

  const notifyAt = new Date(startAt.getTime() - 30 * 60 * 1000);

  const doc = await Reminder.create({
    user: isExistUser._id,
    title: payload.title,
    description: payload.description,
    startAt,
    endAt,
    timezone: payload.timezone,
    notifyAt,
    enabled: payload.hasOwnProperty('enabled')
      ? Boolean(payload.enabled)
      : true,
    status:
      payload.hasOwnProperty('enabled') && Boolean(payload.enabled) === false
        ? 'cancelled'
        : 'scheduled',
  });

  reminderScheduler.schedule(doc);
  return doc;
};

const getMyRemindersFromDB = async (user: JwtPayload) => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return Reminder.find({ user: isExistUser._id }).sort({ startAt: 1 });
};

const updateReminderToDB = async (
  user: JwtPayload,
  id: string,
  payload: Partial<IReminder>,
) => {
  const { id: userId } = user;
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");

  const existing = await Reminder.findOne({ _id: id, user: isExistUser._id });
  if (!existing)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Reminder not found');

  // Validate times if provided
  let startAt = existing.startAt;
  let endAt = existing.endAt;
  if (payload.startAt) startAt = new Date(payload.startAt);
  if (payload.endAt) endAt = new Date(payload.endAt);
  if (endAt <= startAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'End time must be later than start time',
    );
  }

  const notifyAt = payload.startAt
    ? new Date(startAt.getTime() - 30 * 60 * 1000)
    : existing.notifyAt;

  const resolvedEnabled =
    typeof payload.enabled === 'boolean' ? payload.enabled : existing.enabled;
  const resolvedStatus =
    resolvedEnabled === false
      ? 'cancelled'
      : existing.status === 'cancelled'
        ? 'scheduled'
        : existing.status;

  const updated = await Reminder.findByIdAndUpdate(
    id,
    {
      $set: {
        title: payload.title ?? existing.title,
        description: payload.description ?? existing.description,
        startAt,
        endAt,
        timezone: payload.timezone ?? existing.timezone,
        notifyAt,
        status: payload.status ?? resolvedStatus,
        enabled: resolvedEnabled,
      },
    },
    { new: true },
  );

  if (updated) {
    if (updated.enabled) {
      reminderScheduler.reschedule(updated);
    } else {
      reminderScheduler.cancel(id);
    }
  }

  return updated;
};

const deleteReminderFromDB = async (user: JwtPayload, id: string) => {
  const { id: userId } = user;
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");

  const existing = await Reminder.findOne({ _id: id, user: isExistUser._id });
  if (!existing)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Reminder not found');

  await Reminder.findByIdAndDelete(existing._id);
  reminderScheduler.cancel(existing._id.toString());
};

const toggleReminderToDB = async (
  user: JwtPayload,
  id: string,
  enabled: boolean,
) => {
  const { id: userId } = user;
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser)
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");

  const existing = await Reminder.findOne({ _id: id, user: isExistUser._id });
  if (!existing)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Reminder not found');

  const updated = await Reminder.findByIdAndUpdate(
    id,
    {
      $set: {
        enabled,
        status: enabled
          ? existing.status === 'cancelled'
            ? 'scheduled'
            : existing.status
          : 'cancelled',
      },
    },
    { new: true },
  );

  if (!updated) return null;

  if (enabled) {
    // ensure notifyAt is accurate when re-enabling
    const startAt = new Date(updated.startAt);
    const recomputedNotifyAt = new Date(startAt.getTime() - 30 * 60 * 1000);
    if (recomputedNotifyAt.getTime() !== new Date(updated.notifyAt).getTime()) {
      await Reminder.findByIdAndUpdate(id, {
        $set: { notifyAt: recomputedNotifyAt },
      });
      (updated as any).notifyAt = recomputedNotifyAt;
    }
    reminderScheduler.reschedule(updated);
  } else {
    reminderScheduler.cancel(id);
  }

  return updated;
};

export const ReminderService = {
  createReminderToDB,
  getMyRemindersFromDB,
  updateReminderToDB,
  deleteReminderFromDB,
  toggleReminderToDB,
};
