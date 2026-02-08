import { Model } from 'mongoose';

export type PriceType = 'fixed' | 'open_for_bids';
export type JobStatus = 'pending' | 'active' | 'complete';

export type IJob = {
  title: string;
  category: string;
  address?: string;
  postCode?: string;
  photos: string[];
  description?: string;
  budget?: number;
  priceType: PriceType;
  startDate?: Date;
  amountRelease?: number;
  status: JobStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type JobModel = Model<IJob, Record<string, unknown>>;
