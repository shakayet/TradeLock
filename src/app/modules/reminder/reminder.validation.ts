import { z } from 'zod';
import { Types } from 'mongoose';

const baseReminderBody = {
  title: z.string({ required_error: 'Title is required' }),
  description: z.string().optional(),
  startAt: z.string({ required_error: 'Start time is required' }),
  endAt: z.string({ required_error: 'End time is required' }),
  timezone: z.string().optional(),
};

const createReminderZodSchema = z.object({
  body: z
    .object(baseReminderBody)
    .refine(
      data => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(),
      {
        message: 'End time must be later than start time',
        path: ['endAt'],
      },
    ),
});

const updateReminderZodSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      startAt: z.string().optional(),
      endAt: z.string().optional(),
      timezone: z.string().optional(),
      status: z.enum(['scheduled', 'notified', 'cancelled']).optional(),
      enabled: z.boolean().optional(),
    })
    .refine(
      data =>
        !data.startAt ||
        !data.endAt ||
        new Date(data.endAt).getTime() > new Date(data.startAt).getTime(),
      {
        message: 'End time must be later than start time',
        path: ['endAt'],
      },
    ),
});

const toggleReminderZodSchema = z.object({
  body: z.object({
    enabled: z.boolean({ required_error: 'Enabled is required' }),
  }),
});

const reminderIdParamsZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Reminder ID is required' })
      .refine(val => Types.ObjectId.isValid(val), {
        message: 'Invalid Reminder ID',
      }),
  }),
});

export const ReminderValidation = {
  createReminderZodSchema,
  updateReminderZodSchema,
  toggleReminderZodSchema,
  reminderIdParamsZodSchema,
};
