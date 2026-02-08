import { Schema, model } from 'mongoose';
import { IReminder, ReminderModel } from './reminder.interface';

const reminderSchema = new Schema<IReminder, ReminderModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: null,
    },
    notifyAt: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'notified', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    notifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Reminder = model<IReminder, ReminderModel>(
  'Reminder',
  reminderSchema,
);
