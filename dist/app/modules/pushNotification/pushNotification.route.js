"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const pushNotification_controller_1 = require("./pushNotification.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), pushNotification_controller_1.PushNotificationControllers.getAllPushNotifications);
router.post('/send', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), 
// fileUploadHandler(),
// parseAllFilesData({ fieldName: FOLDER_NAMES.IMAGE, forceSingle: true }),
pushNotification_controller_1.PushNotificationControllers.sendPushNotificationController);
exports.PushNotificationRoutes = router;
