import { Model, Types } from 'mongoose';

export type IConversation = {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
};

export type ConversationModel = Model<IConversation, Record<string, unknown>>;
