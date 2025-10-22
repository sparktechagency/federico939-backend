import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DoctorServices } from './doctor.service';
import { DOCTOR_CATEGORY } from './doctor.interface';

// 🩺 Create Doctor
const createDoctor = catchAsync(async (req, res) => {
  const result = await DoctorServices.createDoctor(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
});

// 📋 Get All Doctors
const getAllDoctors = catchAsync(async (req, res) => {
  const result = await DoctorServices.getAllDoctors();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctors retrieved successfully',
    data: result,
  });
});

// 🔍 Get Single Doctor
const getDoctorById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.getDoctorById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor retrieved successfully',
    data: result,
  });
});

// 🌟 Get Special Doctor (by category)
const getSpecialDoctor = catchAsync(async (req, res) => {
  const { category } = req.query;

  if (
    !category ||
    !Object.values(DOCTOR_CATEGORY).includes(category as DOCTOR_CATEGORY)
  ) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid or missing doctor category',
      data: null,
    });
  }

  const result = await DoctorServices.getSpecialDoctor(
    category as DOCTOR_CATEGORY,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Doctors filtered by category: ${category}`,
    data: result,
  });
});

// ✏️ Update Doctor
const updateDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.updateDoctor(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor updated successfully',
    data: result,
  });
});

// 🗑️ Delete Doctor
const deleteDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.deleteDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor deleted successfully',
    data: result,
  });
});

export const DoctorControllers = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getSpecialDoctor,
};
