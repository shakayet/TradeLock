import { Model, Types } from 'mongoose';

export type IConversation = {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  participantKey: string;
};

export type ConversationModel = Model<IConversation, Record<string, unknown>>;
