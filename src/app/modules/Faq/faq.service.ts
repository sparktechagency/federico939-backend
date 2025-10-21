import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { TFaq } from "./faq.interface";
import { Faq } from "./faq.model";
import mongoose from "mongoose";


const createFaqToDB = async (payload: TFaq): Promise<TFaq> => {
  const faq = await Faq.create(payload);
  if (!faq) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to created Faq");
  }

  return faq;
};

const faqsFromDB = async (): Promise<TFaq[]> => {
  const faqs = await Faq.find({});
  return faqs;
};

const updateFaqToDB = async (id: string, payload: TFaq): Promise<TFaq> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const updatedFaq = await Faq.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!updatedFaq) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to updated Faq");
  }

  return updatedFaq;
};

const deleteFaqToDB = async (id: string): Promise<TFaq | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const result = await Faq.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, "Failed to delete faq by this ID");
  }

  return result;
};

export const FaqService = {
  createFaqToDB,
  updateFaqToDB,
  faqsFromDB,
  deleteFaqToDB,
};
