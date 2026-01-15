"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("./doctor.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const files_1 = require("../../enums/files");
const router = express_1.default.Router();
// Example routes with optional auth
router.post('/', (0, fileUploadHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.IMAGE, forceSingle: true }), (0, auth_1.default)(user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), doctor_controller_1.DoctorControllers.createDoctor);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), doctor_controller_1.DoctorControllers.getAllDoctors);
router.get('/special_doctor', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), doctor_controller_1.DoctorControllers.getSpecialDoctor);
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), doctor_controller_1.DoctorControllers.getDoctorById);
router.patch('/:id', (0, fileUploadHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.IMAGE, forceSingle: true }), (0, auth_1.default)(user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), doctor_controller_1.DoctorControllers.updateDoctor);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), doctor_controller_1.DoctorControllers.deleteDoctor);
exports.DoctorRoutes = router;
