"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfAssRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const sa_controller_1 = require("./sa.controller");
const router = express_1.default.Router();
router.get('/categories', 
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
sa_controller_1.SelfAssController.getCategories);
router.get('/:category', 
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
sa_controller_1.SelfAssController.getQuestions);
router.post('/:category/submit', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.SUPER_ADMIN), sa_controller_1.SelfAssController.submitAssessment);
router.get('/history/list', 
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
sa_controller_1.SelfAssController.getHistory);
exports.SelfAssRoutes = router;
