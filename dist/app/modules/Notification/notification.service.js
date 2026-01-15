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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = void 0;
const notification_constant_1 = require("./notification.constant");
const notification_model_1 = require("./notification.model");
const adminNotificationFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({ type: notification_constant_1.NOTIFICATION_TYPE.ADMIN });
    return result;
});
// read notifications only for user
const adminReadNotificationToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ type: notification_constant_1.NOTIFICATION_TYPE.ADMIN, read: false }, { $set: { read: true } }, { new: true });
    return result;
});
// get user notifications by ID
const userNotificationFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({
        receiver: userId,
        type: notification_constant_1.NOTIFICATION_TYPE.USER,
    });
    return result;
});
// read notifications only for user
const userReadNotificationToDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ receiver: userId, type: notification_constant_1.NOTIFICATION_TYPE.USER, read: false }, { $set: { read: true } }, { new: true });
    return result;
});
exports.NotificationServices = {
    adminNotificationFromDB,
    adminReadNotificationToDB,
    userNotificationFromDB,
    userReadNotificationToDB,
};
