import { Model, Types } from 'mongoose';

export type ReminderStatus = 'scheduled' | 'notified' | 'cancelled';

export type IReminder = {
  user: Types.ObjectId;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  timezone?: string;
  notifyAt: Date;
  status: ReminderStatus;
  enabled: boolean;
  notifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ReminderModel = Model<IReminder, Record<string, unknown>>;
