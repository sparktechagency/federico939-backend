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
exports.MoodTrackerControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const moodTracker_service_1 = require("./moodTracker.service");
const CreateOrUpdateMoodTracker = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const moodTrackerData = req.body;
    const result = yield moodTracker_service_1.MoodTrackerServices.CreateOrUpdateMoodTrackerToDB(userId, moodTrackerData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully create or update mood tracker data',
        data: result,
    });
}));
const getMyMoodTrackerHistories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const result = yield moodTracker_service_1.MoodTrackerServices.getMyMoodTrackerHistoriesFromDB(userId, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully get my mood tracker histories',
        data: result.data,
        meta: result.meta,
    });
}));
const getAllMoodTrackerHistories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield moodTracker_service_1.MoodTrackerServices.getAllMoodTrackerHistoriesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully get all mood tracker histories',
        data: result,
    });
}));
const deleteMoodTrackerHistoryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield moodTracker_service_1.MoodTrackerServices.deleteMoodTrackerHistoryByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully delete mood tracker by this ID',
        data: result,
    });
}));
exports.MoodTrackerControllers = {
    CreateOrUpdateMoodTracker,
    getMyMoodTrackerHistories,
    getAllMoodTrackerHistories,
    deleteMoodTrackerHistoryById,
};
