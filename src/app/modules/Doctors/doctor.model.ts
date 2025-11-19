import { model, Schema } from 'mongoose';
import { DOCTOR_CATEGORY, IDoctor } from './doctor.interface';

const DoctorSchema = new Schema<IDoctor>(
  {
    categoryName: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      enum: Object.values(DOCTOR_CATEGORY),
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    chamber: {
      type: String,
      required: false,
      trim: true,
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    about: {
      type: String,
      required: false,
      trim: true,
    },
    total_patient: {
      type: Number,
      default: 0,
    },
    years_of_experience: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 4.8, // constant value (since backend has no source yet)
    },
    available_start_day: {
      type: String,
      required: false,
    },
    available_end_day: {
      type: String,
      required: false,
    },
    available_start_time: {
      type: String,
      required: false,
    },
    available_end_time: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    whatsapp: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Doctor = model<IDoctor>('Doctor', DoctorSchema);
