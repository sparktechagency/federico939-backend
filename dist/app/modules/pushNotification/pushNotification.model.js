"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotification = void 0;
const mongoose_1 = require("mongoose");
const pushNotificationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    topic: {
        type: String,
        default: 'all_users',
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.PushNotification = (0, mongoose_1.model)('PushNotification', pushNotificationSchema);
