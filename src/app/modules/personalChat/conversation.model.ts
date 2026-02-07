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
    participantKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

conversationSchema.index({ participantKey: 1 }, { unique: true, sparse: true });

export const Conversation = model<IConversation, ConversationModel>(
  'Conversation',
  conversationSchema
);
