import { model, Schema } from 'mongoose';
import { TUserPrompt } from './userPrompt.interface';

const userPromptSchema = new Schema<TUserPrompt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    showMoodModal: {
      type: Boolean,
      required: false,
    },
    showPaymentModal: {
      type: Boolean,
      required: false,
    },
    paymentModalCreatedAt: {
      type: String,
      required: false,
    },
    paymentModalIntervalDays: {
      type: Number,
      default: 7,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserPrompt = model('UserPrompt', userPromptSchema);
