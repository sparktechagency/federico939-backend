import { Model } from "mongoose";

export type TFaq = {
  question: string;
  answer: string;
};
export type Faq = Model<TFaq>;
