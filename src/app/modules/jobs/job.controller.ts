/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../../errors/ApiError';
import { JobService } from './job.service';
import { IJob } from './job.interface';
import { deleteFromS3 } from '../../../helpers/s3Helper';
import fs from 'fs';

const removeFiles = (files: any) => {
  if (files) {
    Object.values(files)
      .flat()
      .forEach((file: any) => {
        if (file.location) {
          deleteFromS3(file.location);
        } else if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
  }
};

const createJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      category,
      address,
      postCode,
      description,
      budget,
      priceType,
      startDate,
      amountRelease,
      status,
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const photos = files?.['photos'] || [];
    if (photos.length > 10) {
      removeFiles(files);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'You can upload up to 10 photos',
      );
    }

    const totalImageSize = photos.reduce((sum, img) => sum + img.size, 0);
    const MAX_TOTAL_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
    if (totalImageSize > MAX_TOTAL_IMAGE_SIZE) {
      removeFiles(files);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Total photos size must not exceed 50 MB',
      );
    }

    const photoPaths = getMultipleFilesPath(files, 'photos') || [];

    const payload: IJob = {
      title,
      category,
      address,
      postCode,
      photos: photoPaths,
      description,
      budget,
      priceType,
      startDate,
      amountRelease,
      status: status ?? 'pending',
    };

    const result = await JobService.createJobToDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Job created successfully',
      data: result,
    });
  },
);

const getJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await JobService.getJobsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Jobs retrieved successfully',
    data: result,
  });
});

const getSingleJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await JobService.getSingleJobFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Job retrieved successfully',
    data: result,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    category,
    address,
    postCode,
    description,
    budget,
    priceType,
    startDate,
    amountRelease,
    status,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const newPhotosFiles = files?.['photos'] || [];
  if (newPhotosFiles.length > 10) {
    removeFiles(files);
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You can upload up to 10 photos',
    );
  }
  const totalImageSize = newPhotosFiles.reduce((sum, img) => sum + img.size, 0);
  const MAX_TOTAL_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
  if (totalImageSize > MAX_TOTAL_IMAGE_SIZE) {
    removeFiles(files);
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Total photos size must not exceed 50 MB',
    );
  }

  const newPhotoPaths = getMultipleFilesPath(files, 'photos') || [];

  const payload: Partial<IJob> = {
    title,
    category,
    address,
    postCode,
    description,
    budget,
    priceType,
    startDate,
    amountRelease,
    status,
  };

  const result = await JobService.updateJobToDB(id, payload, newPhotoPaths);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Job updated successfully',
    data: result,
  });
});

export const JobController = {
  createJob,
  getJobs,
  getSingleJob,
  updateJob,
};
