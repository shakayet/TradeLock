import { z } from 'zod';
import { Types } from 'mongoose';

const sendMessageZodSchema = z.object({
  body: z.object({
    conversationId: z.string({ required_error: 'Conversation ID is required' }),
    text: z.string().optional(),
  }),
});

const createConversationZodSchema = z.object({
  body: z.object({
    participantId: z.string({ required_error: 'Participant ID is required' }),
  }),
});

const conversationParamsZodSchema = z.object({
  params: z.object({
    conversationId: z
      .string({ required_error: 'Conversation ID is required' })
      .refine(val => Types.ObjectId.isValid(val), {
        message: 'Invalid conversation ID',
      }),
  }),
});

export const PersonalChatValidation = {
  sendMessageZodSchema,
  createConversationZodSchema,
  conversationParamsZodSchema,
};
