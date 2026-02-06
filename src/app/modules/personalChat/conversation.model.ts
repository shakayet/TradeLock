import { Schema, model } from 'mongoose';
import { ConversationModel, IConversation } from './conversation.interface';

const conversationSchema = new Schema<IConversation, ConversationModel>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Conversation = model<IConversation, ConversationModel>(
  'Conversation',
  conversationSchema
);
