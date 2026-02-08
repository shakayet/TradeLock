import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { Review } from './review.model';
import { IReview } from './review.interface';
import { Job } from '../jobs/job.model';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';

const createReviewToDB = async (user: JwtPayload, payload: Partial<IReview>) => {
  const { id: userId } = user;
  const reviewer = await User.isExistUserById(userId);
  if (!reviewer) throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");

  if (!payload.job || !payload.targetUser || !payload.rating) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields');
  }

  const job = await Job.findById(payload.job);
  if (!job) throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found');
  if (job.status !== 'complete') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You can only review completed jobs');
  }

  const target = await User.isExistUserById(payload.targetUser as any);
  if (!target) throw new ApiError(StatusCodes.NOT_FOUND, 'Target user not found');
  if (![USER_ROLES.TRADE_MAN, USER_ROLES.COMPANY].includes(target.role as any)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Only tradesman or company can be reviewed');
  }

  const existing = await Review.findOne({ user: reviewer._id, job: job._id });
  if (existing) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You have already reviewed this job');
  }

  const doc = await Review.create({
    user: reviewer._id,
    job: job._id,
    targetUser: target._id,
    rating: payload.rating,
    feedback: payload.feedback,
  } as IReview);

  // Update aggregate rating on target user
  const newCount = (target.ratingCount || 0) + 1;
  const newAvg = ((target.rating || 0) * (target.ratingCount || 0) + (payload.rating as number)) / newCount;
  await User.findByIdAndUpdate(target._id, {
    $set: { rating: Number(newAvg.toFixed(2)), ratingCount: newCount },
  });

  return doc;
};

const getReviewsForTargetFromDB = async (targetUserId: string, query: Record<string, unknown>) => {
  const target = await User.isExistUserById(targetUserId);
  if (!target) throw new ApiError(StatusCodes.NOT_FOUND, 'Target user not found');
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Review.find({ targetUser: target._id }).sort('-createdAt').skip(skip).limit(limit),
    Review.countDocuments({ targetUser: target._id }),
  ]);
  return { items, meta: { total, page, limit, totalPage: Math.ceil(total / limit) } };
};

export const ReviewService = {
  createReviewToDB,
  getReviewsForTargetFromDB,
};
