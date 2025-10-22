import { model, Schema } from 'mongoose';
import { DOCTOR_CATEGORY, IDoctor } from './doctor.interface';

const DoctorSchema = new Schema<IDoctor>(
  {
    doctor_id: {
      type: String,
      required: true,
      unique: true,
    },
    doctor_category: {
      type: String,
      enum: Object.values(DOCTOR_CATEGORY),
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    doctor_name: {
      type: String,
      required: true,
      trim: true,
    },
    doctor_chember: {
      type: String,
      required: true,
      trim: true,
    },
    doctor_city: {
      type: String,
      required: true,
      trim: true,
    },
    doctor_about: {
      type: String,
      required: true,
      trim: true,
    },
    doctor_total_patient: {
      type: Number,
      default: 0,
    },
    doctor_years_of_experience: {
      type: Number,
      default: 0,
    },
    doctor_ratings: {
      type: Number,
      default: 4.8, // constant value (since backend has no source yet)
    },
    doctor_available_start_day: {
      type: String,
      required: true,
    },
    doctor_available_end_day: {
      type: String,
      required: true,
    },
    doctor_available_start_time: {
      type: String,
      required: true,
    },
    doctor_available_end_time: {
      type: String,
      required: true,
    },
    doctor_phone: {
      type: String,
      required: true,
    },
    doctor_whatsapp: {
      type: String,
      required: true,
    },
    doctor_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Doctor = model<IDoctor>('Doctor', DoctorSchema);
