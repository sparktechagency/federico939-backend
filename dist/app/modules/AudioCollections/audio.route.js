"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioRoutes = void 0;
// src/app/modules/audio/audio.route.ts
const express_1 = __importDefault(require("express"));
const audio_controller_1 = require("./audio.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const parseAllFileData_1 = __importDefault(require("../../middlewares/parseAllFileData"));
const files_1 = require("../../enums/files");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.AUDIO, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.THUMBNAIL, forceSingle: true }), audio_controller_1.AudioController.createAudio);
router.get('/', audio_controller_1.AudioController.getAllAudio);
router.get('/special_audio', audio_controller_1.AudioController.getSpecialAudio);
router.get('/:audio_id', audio_controller_1.AudioController.getSingleAudio);
router.patch('/:audio_id', (0, auth_1.default)(user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseAllFileData_1.default)({ fieldName: files_1.FOLDER_NAMES.AUDIO, forceSingle: true }, { fieldName: files_1.FOLDER_NAMES.THUMBNAIL, forceSingle: true }), audio_controller_1.AudioController.updateAudio);
router.delete('/:audio_id', (0, auth_1.default)(user_1.USER_ROLES.AUDIO_ADMIN, user_1.USER_ROLES.SUPER_ADMIN), audio_controller_1.AudioController.deleteAudio);
exports.AudioRoutes = router;
