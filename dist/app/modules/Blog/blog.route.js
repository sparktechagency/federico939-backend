"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const blog_controller_1 = require("./blog.controller");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const files_1 = require("../../enums/files");
const router = express_1.default.Router();
router.get('/latest', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), blog_controller_1.BlogControllers.getLatestBlog);
router
    .route('/')
    .post((0, auth_1.default)(user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.THUMBNAIL, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.AUTHORIMAGE, forceSingle: true }), blog_controller_1.BlogControllers.createBlog)
    .get((0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), blog_controller_1.BlogControllers.getAllBLogs);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.DOCTOR_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), blog_controller_1.BlogControllers.getBlogById)
    .patch((0, auth_1.default)(user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.THUMBNAIL, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.AUTHORIMAGE, forceSingle: true }), blog_controller_1.BlogControllers.updateBlogById)
    .delete((0, auth_1.default)(user_1.USER_ROLES.BLOG_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), blog_controller_1.BlogControllers.deleteBlogById);
exports.BlogRoutes = router;
