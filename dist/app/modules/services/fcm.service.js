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
exports.sendToTopic = void 0;
const firebase_1 = require("../../config/firebase");
const logger_1 = require("../../shared/logger");
const pushNotification_model_1 = require("../pushNotification/pushNotification.model");
const sendToTopic = ({ topic, notification,
// data = {},
 }) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        notification: {
            title: notification.title,
            body: notification.body,
        },
        // data: Object.keys(data).length > 0 ? data : undefined,
        topic,
        android: {
            priority: 'high',
            notification: {
                sound: 'default',
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                    badge: 1,
                },
            },
        },
        webpush: {
            headers: {
                Urgency: 'high',
            },
        },
    };
    try {
        const messageId = yield firebase_1.messaging.send(message);
        logger_1.logger.info('FCM sent successfully', { topic, messageId, notification });
        yield pushNotification_model_1.PushNotification.create({
            title: notification.title,
            body: notification.body,
            topic,
        });
        return {
            success: true,
            messageId,
            topic,
            sentAt: new Date().toISOString(),
        };
    }
    catch (error) {
        logger_1.logger.error('FCM send failed', {
            topic,
            error: error.message,
            code: error.code,
        });
        throw error;
    }
});
exports.sendToTopic = sendToTopic;
