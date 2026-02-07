import { Model, Types } from 'mongoose';

export type IMessage = {
  conversationId: Types.ObjectId | string;
  sender: Types.ObjectId | string;
  text?: string;
  images?: string[];
  pdf?: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MessageModel = Model<IMessage, Record<string, unknown>>;
