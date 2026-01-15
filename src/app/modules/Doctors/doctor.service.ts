import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { DOCTOR_CATEGORY, IDoctor } from './doctor.interface';
import { Doctor } from './doctor.model';
import { cleanQuery } from './doctor.utils';

// create Doctor
const createDoctor = async (payload: IDoctor) => {
  const categoryMap = {
    [DOCTOR_CATEGORY.BUSINESS_DOCTOR]: 'Business',
    [DOCTOR_CATEGORY.CAREER_DOCTOR]: 'Career',
    [DOCTOR_CATEGORY.LIFE_DOCTOR]: 'Life',
    [DOCTOR_CATEGORY.MENTAL_DOCTOR]: 'Mental',
    [DOCTOR_CATEGORY.PHYCOLOGIST_DOCTOR]: 'Psychologist',
    [DOCTOR_CATEGORY.SPECIAL_DOCTOR]: 'Special',
  };

  console.log(payload.category);

  const categoryName = categoryMap[payload.category];

  payload.categoryName = categoryName;

  const result = await Doctor.create(payload);
  return result;
};

// get All Doctors
const getAllDoctors = async (rawQuery: any) => {
  const query = cleanQuery(rawQuery);
  const resultQuery = new QueryBuilder(
    Doctor.find().sort({ createdAt: -1 }),
    query,
  )
    .search([
      'name',
      'category',
      'chamber',
      'city',
      'about',
      'available_start_day',
      'available_end_day',
      'available_start_time',
      'available_end_time',
      'whatsapp',
      'phone',
      'email',
    ])
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();
  return { data: result, meta };
};

// get Single Doctor by ID
const getDoctorById = async (id: string) => {
  const result = await Doctor.findById(id);
  return result;
};

// get Special Doctors (filter by category)
const getSpecialDoctor = async (rawQuery: any) => {
  const query = cleanQuery(rawQuery);
  const resultQuery = new QueryBuilder(
    Doctor.find({ doctor_category: DOCTOR_CATEGORY.SPECIAL_DOCTOR }).sort({
      createdAt: -1,
    }),
    query,
  )
    .search([
      'name',
      'category',
      'chamber',
      'city',
      'about',
      'available_start_day',
      'available_end_day',
      'available_start_time',
      'available_end_time',
      'whatsapp',
      'phone',
      'email',
    ])
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  // Default sort fallback: latest first
  if (!query.sort) {
    resultQuery.modelQuery = resultQuery.modelQuery.sort({ createdAt: -1 });
  }
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();
  return { data: result, meta };
};

const updateDoctor = async (id: string, payload: Partial<IDoctor>) => {
  if (payload.category) {
    const categoryMap: Record<DOCTOR_CATEGORY, string> = {
      [DOCTOR_CATEGORY.BUSINESS_DOCTOR]: 'Business',
      [DOCTOR_CATEGORY.CAREER_DOCTOR]: 'Career',
      [DOCTOR_CATEGORY.LIFE_DOCTOR]: 'Life',
      [DOCTOR_CATEGORY.MENTAL_DOCTOR]: 'Mental',
      [DOCTOR_CATEGORY.PHYCOLOGIST_DOCTOR]: 'Psychologist',
      [DOCTOR_CATEGORY.SPECIAL_DOCTOR]: 'Special',
    };

    payload.categoryName = categoryMap[payload.category];
  }

  const result = await Doctor.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(404, 'Doctor not found or failed to update');
  }

  return result;
};



// delete Doctor
const deleteDoctor = async (id: string) => {
  const result = await Doctor.findByIdAndDelete(id);
  return result;
};

export const DoctorServices = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getSpecialDoctor,
};
