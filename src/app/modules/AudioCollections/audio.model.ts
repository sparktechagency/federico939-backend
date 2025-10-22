import { model, Schema } from 'mongoose';
import { AudioCategory, IAudio } from './audio.interface';

const audioSchema = new Schema<IAudio>(
  {
    // audio_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    author: { type: String, required: true },
    audio: { type: String, required: true },
    duration: { type: Number, required: true },
    total_duration: { type: Number, required: true },
    category: {
      type: String,
      enum: Object.values(AudioCategory),
      required: true,
    },
  },
  { timestamps: true },
);

export const Audio = model<IAudio>('Audio', audioSchema);
