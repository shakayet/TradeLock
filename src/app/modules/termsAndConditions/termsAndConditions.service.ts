import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ITermsAndConditions } from './termsAndConditions.interface';
import { TermsAndConditions } from './termsAndConditions.model';

const createTermsAndConditionsToDB = async (
  payload: ITermsAndConditions
): Promise<ITermsAndConditions> => {
  const result = await TermsAndConditions.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create Terms and Conditions'
    );
  }
  return result;
};

const getTermsAndConditionsFromDB = async (): Promise<ITermsAndConditions[]> => {
  const result = await TermsAndConditions.find().sort({ createdAt: -1 });
  return result;
};

const updateTermsAndConditionsToDB = async (
  id: string,
  payload: Partial<ITermsAndConditions>
): Promise<ITermsAndConditions | null> => {
  const isExist = await TermsAndConditions.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and Conditions not found');
  }

  const result = await TermsAndConditions.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );

  return result;
};

const deleteTermsAndConditionsFromDB = async (
  id: string
): Promise<ITermsAndConditions | null> => {
  const isExist = await TermsAndConditions.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and Conditions not found');
  }

  const result = await TermsAndConditions.findByIdAndDelete(id);
  return result;
};

export const TermsAndConditionsService = {
  createTermsAndConditionsToDB,
  getTermsAndConditionsFromDB,
  updateTermsAndConditionsToDB,
  deleteTermsAndConditionsFromDB,
};
