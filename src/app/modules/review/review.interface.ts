import { Model, Types } from 'mongoose';

export type IReview = {
  user: Types.ObjectId;
  job: Types.ObjectId;
  targetUser: Types.ObjectId;
  rating: number;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;
