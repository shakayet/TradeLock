import { Schema, model } from 'mongoose';
import { IJob, JobModel } from './job.interface';

const jobSchema = new Schema<IJob, JobModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: null,
      trim: true,
    },
    postCode: {
      type: String,
      default: null,
      trim: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: null,
    },
    budget: {
      type: Number,
      default: null,
      min: 0,
    },
    priceType: {
      type: String,
      enum: ['fixed', 'open_for_bids'],
      required: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    amountRelease: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'complete'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Job = model<IJob, JobModel>('Job', jobSchema);
