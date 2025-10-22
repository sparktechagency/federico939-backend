/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';

export enum DOCTOR_CATEGORY {
  PHYCOLOGIST_DOCTOR = 'PHYCOLOGIST_DOCTOR',
  BUSINESS_DOCTOR = 'BUSINESS_DOCTOR',
  LIFE_DOCTOR = 'LIFE_DOCTOR',
}

export interface IDoctor extends Document {
  doctor_id: string;
  doctor_category: DOCTOR_CATEGORY;
  image: string;
  doctor_name: string;
  doctor_chember: string;
  doctor_city: string;
  doctor_about: string;
  doctor_total_patient: number;
  doctor_years_of_experience: number;
  doctor_ratings: number;
  doctor_available_start_day: string;
  doctor_available_end_day: string;
  doctor_available_start_time: string; // 12h format e.g. "09:00 AM"
  doctor_available_end_time: string; // 12h format e.g. "05:00 PM"
  doctor_phone: string;
  doctor_whatsapp: string;
  doctor_email: string;
}
