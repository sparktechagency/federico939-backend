"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_1 = require("../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const files_1 = require("../../enums/files");
const router = express_1.default.Router();
router
    .route('/profile')
    .get((0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getUserProfile)
    .delete((0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.deleteProfile);
router.post('/create-admin', (0, validateRequest_1.default)(user_validation_1.UserValidation.createAdminZodSchema), user_controller_1.UserController.createAdmin);
router
    .route('/')
    .post(user_controller_1.UserController.createUser)
    .patch((0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseAllFileData_1.default)({
    fieldName: files_1.FOLDER_NAMES.PROFILE_IMAGE,
    forceSingle: true,
}), user_controller_1.UserController.updateProfile)
    .get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getAllUsers);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getUserById)
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.deleteUserById);
router.patch('/:id/status', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.updateUserStatusById);
exports.UserRoutes = router;
