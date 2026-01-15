"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogBookmarkRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const blogBookmark_validation_1 = require("./blogBookmark.validation");
const blogBookmark_controller_1 = require("./blogBookmark.controller");
const router = express_1.default.Router();
router.post('/toggle', (0, auth_1.default)(user_1.USER_ROLES.USER), (0, validateRequest_1.default)(blogBookmark_validation_1.BookmarkValidation.toggleBookmark), blogBookmark_controller_1.BlogBookmarkControllers.toggleBlogBookmark);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.USER), blogBookmark_controller_1.BlogBookmarkControllers.getBlogBookmark);
router.delete('/:referenceId', (0, auth_1.default)(user_1.USER_ROLES.USER), blogBookmark_controller_1.BlogBookmarkControllers.deleteBlogBookmarkByID);
exports.BlogBookmarkRoutes = router;
