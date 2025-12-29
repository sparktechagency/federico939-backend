/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';

export enum DOCTOR_CATEGORY {
  PHYCOLOGIST_DOCTOR = 'PHYCOLOGIST_DOCTOR',
  BUSINESS_DOCTOR = 'BUSINESS_DOCTOR',
  LIFE_DOCTOR = 'LIFE_DOCTOR',
  SPECIAL_DOCTOR = 'SPECIAL_DOCTOR',
  MENTAL_DOCTOR = 'MENTAL_DOCTOR',
  CAREER_DOCTOR = 'CAREER_DOCTOR',
}

export interface IDoctor extends Document {
  // doctor_id: string;
  category: DOCTOR_CATEGORY;
  categoryName?: string;
  image: string;
  name: string;
  chamber: string;
  city: string;
  about: string;
  total_patient: number;
  years_of_experience: number;
  ratings: number;
  available_start_day: string;
  available_end_day: string;
  available_start_time: string; // 12h format e.g. "09:00 AM"
  available_end_time: string; // 12h format e.g. "05:00 PM"
  phone: string;
  whatsapp: string;
  email: string;
  isBestDoctor?: boolean;
}
