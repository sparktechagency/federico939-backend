"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const doctor_interface_1 = require("./doctor.interface");
const doctor_model_1 = require("./doctor.model");
const doctor_utils_1 = require("./doctor.utils");
// 🩺 Create Doctor
const createDoctor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryMap = {
        [doctor_interface_1.DOCTOR_CATEGORY.BUSINESS_DOCTOR]: 'Business',
        [doctor_interface_1.DOCTOR_CATEGORY.CAREER_DOCTOR]: 'Career',
        [doctor_interface_1.DOCTOR_CATEGORY.LIFE_DOCTOR]: 'Life',
        [doctor_interface_1.DOCTOR_CATEGORY.MENTAL_DOCTOR]: 'Mental',
        [doctor_interface_1.DOCTOR_CATEGORY.PHYCOLOGIST_DOCTOR]: 'Psychologist',
        [doctor_interface_1.DOCTOR_CATEGORY.SPECIAL_DOCTOR]: 'Special',
    };
    const categoryName = categoryMap[payload.category];
    payload.categoryName = categoryName;
    const result = yield doctor_model_1.Doctor.create(payload);
    return result;
});
// 📋 Get All Doctors
const getAllDoctors = (rawQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, doctor_utils_1.cleanQuery)(rawQuery);
    const resultQuery = new QueryBuilder_1.default(doctor_model_1.Doctor.find().sort({ createdAt: -1 }), query)
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
    const result = yield resultQuery.modelQuery;
    const meta = yield resultQuery.countTotal();
    return { data: result, meta };
});
// 🔍 Get Single Doctor by ID
const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_model_1.Doctor.findById(id);
    return result;
});
// 🌟 Get Special Doctors (filter by category)
const getSpecialDoctor = (rawQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, doctor_utils_1.cleanQuery)(rawQuery);
    const resultQuery = new QueryBuilder_1.default(doctor_model_1.Doctor.find({ doctor_category: doctor_interface_1.DOCTOR_CATEGORY.SPECIAL_DOCTOR }).sort({
        createdAt: -1,
    }), query)
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
    const result = yield resultQuery.modelQuery;
    const meta = yield resultQuery.countTotal();
    return { data: result, meta };
});
const updateDoctor = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.category) {
        const categoryMap = {
            [doctor_interface_1.DOCTOR_CATEGORY.BUSINESS_DOCTOR]: 'Business',
            [doctor_interface_1.DOCTOR_CATEGORY.CAREER_DOCTOR]: 'Career',
            [doctor_interface_1.DOCTOR_CATEGORY.LIFE_DOCTOR]: 'Life',
            [doctor_interface_1.DOCTOR_CATEGORY.MENTAL_DOCTOR]: 'Mental',
            [doctor_interface_1.DOCTOR_CATEGORY.PHYCOLOGIST_DOCTOR]: 'Psychologist',
            [doctor_interface_1.DOCTOR_CATEGORY.SPECIAL_DOCTOR]: 'Special',
        };
        payload.categoryName = categoryMap[payload.category];
    }
    const result = yield doctor_model_1.Doctor.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(404, 'Doctor not found or failed to update');
    }
    return result;
});
// 🗑️ Delete Doctor
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_model_1.Doctor.findByIdAndDelete(id);
    return result;
});
exports.DoctorServices = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    getSpecialDoctor,
};
