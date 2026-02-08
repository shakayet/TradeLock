import { z } from 'zod';
import { Types } from 'mongoose';

const createReviewZodSchema = z.object({
  body: z.object({
    job: z
      .string({ required_error: 'Job ID is required' })
      .refine(val => Types.ObjectId.isValid(val), { message: 'Invalid Job ID' }),
    targetUser: z
      .string({ required_error: 'Target user ID is required' })
      .refine(val => Types.ObjectId.isValid(val), { message: 'Invalid User ID' }),
    rating: z.number({ required_error: 'Rating is required' }).min(1).max(5),
    feedback: z.string().optional(),
  }),
});

const reviewIdParamsZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Review ID is required' })
      .refine(val => Types.ObjectId.isValid(val), { message: 'Invalid Review ID' }),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  reviewIdParamsZodSchema,
};
