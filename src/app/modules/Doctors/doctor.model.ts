import { model, Schema } from 'mongoose';
import { DOCTOR_CATEGORY, IDoctor } from './doctor.interface';

const DoctorSchema = new Schema<IDoctor>(
  {
    // doctor_id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    category: {
      type: String,
      enum: Object.values(DOCTOR_CATEGORY),
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    chember: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
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
      required: true,
    },
    available_end_day: {
      type: String,
      required: true,
    },
    available_start_time: {
      type: String,
      required: true,
    },
    available_end_time: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Doctor = model<IDoctor>('Doctor', DoctorSchema);
