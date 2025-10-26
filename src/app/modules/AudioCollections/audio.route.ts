// src/app/modules/audio/audio.route.ts
import express from 'express';
import { AudioController } from './audio.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import parseAllFilesData from '../../middlewares/parseAllFileData';
import { FOLDER_NAMES } from '../../enums/files';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  parseAllFilesData({ fieldName: FOLDER_NAMES.AUDIO, forceSingle: true }),
  AudioController.createAudio,
);
router.get('/', AudioController.getAllAudio);
router.get('/special_audio', AudioController.getSpecialAudio);
router.get('/:audio_id', AudioController.getSingleAudio);
router.patch('/:audio_id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), AudioController.updateAudio);
router.delete(
  '/:audio_id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AudioController.deleteAudio,
);

export const AudioRoutes = router;
