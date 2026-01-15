"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodTracker = void 0;
const mongoose_1 = require("mongoose");
const moodTracker_constant_1 = require("./moodTracker.constant");
const moodTrackerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: false,
    },
    moodType: {
        type: String,
        enum: Object.values(moodTracker_constant_1.MOOD_TYPE),
    },
    source: {
        type: String,
        enum: Object.values(moodTracker_constant_1.SOURCE),
    },
    category: {
        type: String,
        required: false,
    },
    resultLabel: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.MoodTracker = (0, mongoose_1.model)('MoodTracker', moodTrackerSchema);
