import mongoose, { Schema } from 'mongoose';
import { IAnswer, ISelfAssessment } from './sa.interface';

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Number, required: true },
    question: { type: String, required: true },
    selectedOption: { type: String, required: true },
    score: { type: Number, required: true },
    extra: { type: Object },
  },
  { _id: false },
);

const SelfAssessmentSchema = new Schema<ISelfAssessment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Anxiety', 'Depression', 'Stress', 'Personality'],
      required: true,
    },
    totalScore: { type: Number, required: true },
    resultLabel: { type: String, required: true },
    interpretation: { type: String, required: true },
    answers: { type: [AnswerSchema], default: [] },
    traits: { type: Object },
  },
  { timestamps: true },
);

const SelfAssessmentModel = mongoose.model<ISelfAssessment>(
  'SelfAssessment',
  SelfAssessmentSchema,
);

export default SelfAssessmentModel;
