import QueryBuilder from '../../builder/QueryBuilder';
import { DOCTOR_CATEGORY, IDoctor } from './doctor.interface';
import { Doctor } from './doctor.model';
import { cleanQuery } from './doctor.utils';

// 🩺 Create Doctor
const createDoctor = async (payload: IDoctor) => {
  const result = await Doctor.create(payload);
  return result;
};

// 📋 Get All Doctors
const getAllDoctors = async (rawQuery: any) => {
  const query = cleanQuery(rawQuery);
  const resultQuery = new QueryBuilder(Doctor.find().sort({ createdAt: -1 }), query)
    .search(["name", "category", "chamber","city", "about","available_start_day", "available_end_day","available_start_time","available_end_time","whatsapp","phone","email"])
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();
  return { data: result, meta };
};

// 🔍 Get Single Doctor by ID
const getDoctorById = async (id: string) => {
  const result = await Doctor.findById(id);
  return result;
};

// 🌟 Get Special Doctors (filter by category)
const getSpecialDoctor = async (rawQuery: any) => {
   const query = cleanQuery(rawQuery);
  const resultQuery = new QueryBuilder(Doctor.find({ doctor_category: DOCTOR_CATEGORY.SPECIAL_DOCTOR })
    .sort({ createdAt: -1 }), query)
    .search(["name", "category", "chamber","city", "about","available_start_day", "available_end_day","available_start_time","available_end_time","whatsapp","phone","email"])
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

// ✏️ Update Doctor
const updateDoctor = async (id: string, payload: Partial<IDoctor>) => {
  const result = await Doctor.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// 🗑️ Delete Doctor
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
