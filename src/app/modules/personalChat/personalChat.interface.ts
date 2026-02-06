import { Model, Types } from 'mongoose';

export type IMessage = {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  text?: string;
  images?: string[];
  pdf?: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MessageModel = Model<IMessage, Record<string, unknown>>;
