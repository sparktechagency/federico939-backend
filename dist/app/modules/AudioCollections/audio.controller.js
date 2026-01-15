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
exports.AudioController = void 0;
// src/app/modules/audio/audio.controller.ts
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const audio_service_1 = require("./audio.service");
// 🎵 Create Audio
const createAudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_service_1.AudioService.createAudio(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Audio created successfully',
        data: result,
    });
}));
// 🎧 Get All Audio
const getAllAudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_service_1.AudioService.getAllAudio(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Audios retrieved successfully',
        data: result,
    });
}));
// 🎼 Get Single Audio
const getSingleAudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_service_1.AudioService.getSingleAudio(req.params.audio_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single audio retrieved successfully',
        data: result,
    });
}));
// 💎 Get Special Audio
const getSpecialAudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_service_1.AudioService.getSpecialAudio();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Special audios retrieved successfully',
        data: result,
    });
}));
// ✏️ Update Audio
const updateAudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_service_1.AudioService.updateAudio(req.params.audio_id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Audio updated successfully',
        data: result,
    });
}));
// 🗑️ Delete Audio
const deleteAudio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_service_1.AudioService.deleteAudio(req.params.audio_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Audio deleted successfully',
        data: result,
    });
}));
exports.AudioController = {
    createAudio,
    getAllAudio,
    getSingleAudio,
    getSpecialAudio,
    updateAudio,
    deleteAudio,
};
