"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = void 0;
const mongoose_1 = require("mongoose");
const audio_interface_1 = require("./audio.interface");
const audioSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    thumbnail: {
        type: String,
        default: '',
    },
    audio: { type: String, required: true },
    duration: { type: String, required: false },
    // total_duration: { type: Number, required: false },
    category: {
        type: String,
        enum: Object.values(audio_interface_1.AudioCategory),
        required: true,
    },
}, { timestamps: true });
exports.Audio = (0, mongoose_1.model)('Audio', audioSchema);
