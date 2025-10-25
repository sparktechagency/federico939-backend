import { Document, Types } from 'mongoose';

export interface IAnswer {
  questionId: number;
  question: string;
  selectedOption: string;
  score: number;
  extra?: Record<string, unknown>; // e.g. { trait: "Openness", reverseScored: true }
}

export interface ITraits {
  Openness?: number;
  Conscientiousness?: number;
  Extraversion?: number;
  Agreeableness?: number;
  Neuroticism?: number;
}

export interface ISelfAssessment extends Document {
  userId: Types.ObjectId;
  category: 'Anxiety' | 'Depression' | 'Stress' | 'Personality';
  totalScore: number;
  resultLabel: string;
  interpretation: string;
  answers: IAnswer[];
  traits?: ITraits;
  createdAt: Date;
  updatedAt: Date;
}
