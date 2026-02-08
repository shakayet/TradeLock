import { Job } from './job.model';
import { IJob } from './job.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';

const createJobToDB = async (payload: IJob) => {
  const job = await Job.create(payload);
  return job;
};

const getJobsFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(Job.find(), query)
    .search(['category'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const jobs = await qb.modelQuery.exec();
  const meta = await qb.getPaginationInfo();
  return { jobs, meta };
};

const getSingleJobFromDB = async (id: string) => {
  return Job.findById(id);
};

const updateJobToDB = async (
  id: string,
  payload: Partial<IJob>,
  newPhotos: string[] = [],
) => {
  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found');
  }

  const mergedPhotos =
    newPhotos.length > 0
      ? [...job.photos, ...newPhotos].slice(0, 10)
      : job.photos;

  const updateDoc = await Job.findByIdAndUpdate(
    id,
    { $set: { ...payload, photos: mergedPhotos } },
    { new: true },
  );

  return updateDoc;
};

export const JobService = {
  createJobToDB,
  getJobsFromDB,
  getSingleJobFromDB,
  updateJobToDB,
};
