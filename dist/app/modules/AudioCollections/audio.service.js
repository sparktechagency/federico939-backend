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
exports.AudioService = void 0;
// src/app/modules/audio/audio.service.ts
const path_1 = __importDefault(require("path"));
const audio_interface_1 = require("./audio.interface");
const audio_model_1 = require("./audio.model");
const music_metadata_1 = require("music-metadata");
// 🆕 Create
const createAudio = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.audio) {
        let fullPath;
        fullPath = path_1.default.join(process.cwd(), 'uploads', 'audio', path_1.default.basename(payload.audio));
        const metadata = yield (0, music_metadata_1.parseFile)(fullPath);
        const durationInSeconds = metadata.format.duration;
        if (durationInSeconds) {
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = Math.floor(durationInSeconds % 60);
            // Format with leading zeros
            const mm = String(minutes).padStart(2, '0');
            const ss = String(seconds).padStart(2, '0');
            payload.duration = `${mm}:${ss}`;
        }
    }
    const result = yield audio_model_1.Audio.create(payload);
    return result;
});
// 🧾 Get All with pagination, category filtering
const getAllAudio = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, audio_category } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (audio_category && audio_category !== audio_interface_1.AudioCategory.LATEST_AUDIO) {
        filter.audio_category = audio_category;
    }
    let result;
    // 🌀 Handle LATEST_AUDIO
    if (audio_category === audio_interface_1.AudioCategory.LATEST_AUDIO) {
        const latestCount = query.latestCount ? Number(query.latestCount) : 3;
        result = yield audio_model_1.Audio.find({})
            .sort({ createdAt: -1 })
            .limit(latestCount)
            .lean();
    }
    // 🎧 Handle DAILY_AUDIO random logic (simplified)
    else if (audio_category === audio_interface_1.AudioCategory.DAILY_AUDIO) {
        // Check if dashboard audio available (pseudo logic)
        const dashboardAudio = yield audio_model_1.Audio.findOne({
            audio_category: 'DAILY_AUDIO',
        });
        if (dashboardAudio) {
            result = [dashboardAudio];
        }
        else {
            const count = yield audio_model_1.Audio.countDocuments({});
            const random = Math.floor(Math.random() * count);
            result = yield audio_model_1.Audio.find({}).skip(random).limit(1);
        }
    }
    else {
        result = yield audio_model_1.Audio.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });
    }
    const total = yield audio_model_1.Audio.countDocuments(filter);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: result,
    };
});
// 🔍 Get Single
const getSingleAudio = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_model_1.Audio.findById(id);
    return result;
});
// 🧩 Update
const updateAudio = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_model_1.Audio.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
// ❌ Delete
const deleteAudio = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_model_1.Audio.findByIdAndDelete(id);
    return result;
});
// 🌟 Get Special Audio (custom logic placeholder)
const getSpecialAudio = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_model_1.Audio.find({}).limit(5);
    return result;
});
exports.AudioService = {
    createAudio,
    getAllAudio,
    getSingleAudio,
    updateAudio,
    deleteAudio,
    getSpecialAudio,
};
