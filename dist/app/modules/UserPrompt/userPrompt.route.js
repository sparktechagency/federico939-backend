"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPromptRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const userPrompt_controller_1 = require("./userPrompt.controller");
const router = express_1.default.Router();
router.get('/login-prompts', (0, auth_1.default)(user_1.USER_ROLES.USER), userPrompt_controller_1.UserPromptControllers.checkPrompts);
router.patch('/update-payment-interval', (0, auth_1.default)(user_1.USER_ROLES.USER), userPrompt_controller_1.UserPromptControllers.updatePaymentInterval);
exports.UserPromptRoutes = router;
