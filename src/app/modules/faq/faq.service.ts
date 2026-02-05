import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IFaq } from './faq.interface';
import { Faq } from './faq.model';

const createFaqToDB = async (payload: IFaq): Promise<IFaq> => {
  const createFaq = await Faq.create(payload);
  if (!createFaq) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create FAQ');
  }
  return createFaq;
};

const getAllFaqFromDB = async (): Promise<IFaq[]> => {
  const allFaq = await Faq.find();
  return allFaq;
};

const getSingleFaqFromDB = async (id: string): Promise<IFaq | null> => {
  const faq = await Faq.findById(id);
  if (!faq) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'FAQ not found');
  }
  return faq;
};

const updateFaqToDB = async (
  id: string,
  payload: Partial<IFaq>
): Promise<IFaq | null> => {
  const faqSize = await Faq.findById(id);
  if (!faqSize) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'FAQ not found');
  }

  const updateDoc = await Faq.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const deleteFaqFromDB = async (id: string): Promise<IFaq | null> => {
  const faq = await Faq.findById(id);
  if (!faq) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'FAQ not found');
  }

  const deleteDoc = await Faq.findByIdAndDelete(id);
  return deleteDoc;
};

export const FaqService = {
  createFaqToDB,
  getAllFaqFromDB,
  getSingleFaqFromDB,
  updateFaqToDB,
  deleteFaqFromDB,
};
