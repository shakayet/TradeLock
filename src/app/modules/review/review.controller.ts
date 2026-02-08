/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await ReviewService.createReviewToDB(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getReviewsForTarget = catchAsync(async (req: Request, res: Response) => {
  const { targetUserId } = req.params;
  const result = await ReviewService.getReviewsForTargetFromDB(targetUserId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviewsForTarget,
};
