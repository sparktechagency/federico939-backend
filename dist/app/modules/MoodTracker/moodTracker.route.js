"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodTrackerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const moodTracker_controller_1 = require("./moodTracker.controller");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_1.USER_ROLES.USER), moodTracker_controller_1.MoodTrackerControllers.CreateOrUpdateMoodTracker)
    .get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), moodTracker_controller_1.MoodTrackerControllers.getAllMoodTrackerHistories);
router.delete('/:id', moodTracker_controller_1.MoodTrackerControllers.deleteMoodTrackerHistoryById);
router.get('/my', (0, auth_1.default)(user_1.USER_ROLES.USER), moodTracker_controller_1.MoodTrackerControllers.getMyMoodTrackerHistories);
exports.MoodTrackerRoutes = router;
