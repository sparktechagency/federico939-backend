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
exports.PushNotificationControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const fcm_service_1 = require("../services/fcm.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pushNotification_model_1 = require("./pushNotification.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const doctor_utils_1 = require("../Doctors/doctor.utils");
const sendPushNotificationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, title, body } = req.body;
    const result = yield (0, fcm_service_1.sendToTopic)({
        topic,
        notification: { title, body },
        // data,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Push notification sent successfully',
        data: result,
    });
}));
const getAllPushNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req?.query push', req === null || req === void 0 ? void 0 : req.query);
    const query = (0, doctor_utils_1.cleanQuery)(req === null || req === void 0 ? void 0 : req.query);
    const resultQuery = new QueryBuilder_1.default(pushNotification_model_1.PushNotification.find().sort({ createdAt: -1 }), req === null || req === void 0 ? void 0 : req.query)
        .filter()
        .paginate()
        .limit()
        .fields();
    const result = yield resultQuery.modelQuery;
    console.log(' result', result === null || result === void 0 ? void 0 : result.length);
    const meta = yield resultQuery.countTotal();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Push notifications retrieved successfully',
        data: result,
        meta,
    });
}));
exports.PushNotificationControllers = {
    sendPushNotificationController,
    getAllPushNotifications,
};
