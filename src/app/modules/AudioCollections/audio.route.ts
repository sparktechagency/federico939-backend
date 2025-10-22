// src/app/modules/audio/audio.route.ts
import express from 'express';
import { AudioController } from './audio.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', auth(USER_ROLE.admin), AudioController.createAudio);
router.get('/', AudioController.getAllAudio);
router.get('/special_audio', AudioController.getSpecialAudio);
router.get('/:audio_id', AudioController.getSingleAudio);
router.patch('/:audio_id', auth(USER_ROLE.admin), AudioController.updateAudio);
router.delete('/:audio_id', auth(USER_ROLE.admin), AudioController.deleteAudio);

export const AudioRoutes = router;
