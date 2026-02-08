import { z } from 'zod';
import { Types } from 'mongoose';

const createJobZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    category: z.string({ required_error: 'Job category is required' }),
    address: z.string().optional(),
    postCode: z.string().optional(),
    description: z.string().optional(),
    budget: z.number().min(0).optional(),
    priceType: z.enum(['fixed', 'open_for_bids']),
    startDate: z.coerce.date().optional(),
    amountRelease: z.number().min(0).optional(),
    status: z.enum(['pending', 'active', 'complete']).optional(),
  }),
});

const getJobsQueryZodSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    searchTerm: z.string().optional(),
    category: z.string().optional(),
  }),
});

const updateJobZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    address: z.string().optional(),
    postCode: z.string().optional(),
    description: z.string().optional(),
    budget: z.number().min(0).optional(),
    priceType: z.enum(['fixed', 'open_for_bids']).optional(),
    startDate: z.coerce.date().optional(),
    amountRelease: z.number().min(0).optional(),
    status: z.enum(['pending', 'active', 'complete']).optional(),
  }),
});

const jobIdParamsZodSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Job ID is required' })
      .refine(val => Types.ObjectId.isValid(val), {
        message: 'Invalid Job ID',
      }),
  }),
});

export const JobValidation = {
  createJobZodSchema,
  getJobsQueryZodSchema,
  updateJobZodSchema,
  jobIdParamsZodSchema,
};
