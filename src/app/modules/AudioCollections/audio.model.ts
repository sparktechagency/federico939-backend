import { model, Schema } from 'mongoose';
import { AudioCategory, IAudio } from './audio.interface';

const audioSchema = new Schema<IAudio>(
  {
    audio_id: { type: String, required: true, unique: true },
    audio_name: { type: String, required: true },
    audio_author: { type: String, required: true },
    audio_url: { type: String, required: true },
    audio_duration: { type: Number, required: true },
    audio_total_duration: { type: Number, required: true },
    audio_category: {
      type: String,
      enum: Object.values(AudioCategory),
      required: true,
    },
  },
  { timestamps: true },
);

export const Audio = model<IAudio>('Audio', audioSchema);
