import { z } from 'zod';

const sendMessageZodSchema = z.object({
  body: z.object({
    conversationId: z.string({ required_error: 'Conversation ID is required' }),
    text: z.string().optional(),
    images: z.array(z.string()).optional(),
    pdf: z.string().optional(),
  }),
});

const createConversationZodSchema = z.object({
  body: z.object({
    participantId: z.string({ required_error: 'Participant ID is required' }),
  }),
});

export const PersonalChatValidation = {
  sendMessageZodSchema,
  createConversationZodSchema,
};
