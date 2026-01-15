"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrompt = void 0;
const mongoose_1 = require("mongoose");
const userPromptSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    showMoodModal: {
        type: Boolean,
        required: false,
    },
    showPaymentModal: {
        type: Boolean,
        required: false,
    },
    paymentModalCreatedAt: {
        type: String,
        required: false,
    },
    paymentModalIntervalDays: {
        type: Number,
        default: 7,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.UserPrompt = (0, mongoose_1.model)('UserPrompt', userPromptSchema);
