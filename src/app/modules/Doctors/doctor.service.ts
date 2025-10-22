import { DOCTOR_CATEGORY, IDoctor } from './doctor.interface';
import { Doctor } from './doctor.model';

// 🩺 Create Doctor
const createDoctor = async (payload: IDoctor) => {
  const result = await Doctor.create(payload);
  return result;
};

// 📋 Get All Doctors
const getAllDoctors = async () => {
  const result = await Doctor.find().sort({ createdAt: -1 });
  return result;
};

// 🔍 Get Single Doctor by ID
const getDoctorById = async (id: string) => {
  const result = await Doctor.findById(id);
  return result;
};

// 🌟 Get Special Doctors (filter by category)
const getSpecialDoctor = async (category: DOCTOR_CATEGORY) => {
  const result = await Doctor.find({ doctor_category: category });
  return result;
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
