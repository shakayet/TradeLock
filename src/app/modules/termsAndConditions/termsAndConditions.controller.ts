import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TermsAndConditionsService } from './termsAndConditions.service';

const createTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
  const result = await TermsAndConditionsService.createTermsAndConditionsToDB(
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms and Conditions created successfully',
    data: result,
  });
});

const getTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
  const result = await TermsAndConditionsService.getTermsAndConditionsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms and Conditions retrieved successfully',
    data: result,
  });
});

const updateTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
  const result = await TermsAndConditionsService.updateTermsAndConditionsToDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms and Conditions updated successfully',
    data: result,
  });
});

const deleteTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
  const result = await TermsAndConditionsService.deleteTermsAndConditionsFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms and Conditions deleted successfully',
    data: result,
  });
});

export const TermsAndConditionsController = {
  createTermsAndConditions,
  getTermsAndConditions,
  updateTermsAndConditions,
  deleteTermsAndConditions,
};
