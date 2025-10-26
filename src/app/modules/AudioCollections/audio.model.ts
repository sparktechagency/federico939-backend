import { model, Schema } from 'mongoose';
import { AudioCategory, IAudio } from './audio.interface';

const audioSchema = new Schema<IAudio>(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    thumbnail: {
      type: String,
      default: ""
    },
    audio: { type: String, required: true },
    duration: { type: Number, required: false },
    total_duration: { type: Number, required: false },
    category: {
      type: String,
      enum: Object.values(AudioCategory),
      required: true,
    },
  },
  { timestamps: true },
);

export const Audio = model<IAudio>('Audio', audioSchema);
