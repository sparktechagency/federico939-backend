import express from 'express';
import { PushNotificationControllers } from './pushNotification.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import parseAllFilesData from '../../middlewares/parseAllFileData';
import { FOLDER_NAMES } from '../../enums/files';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';

const router = express.Router();

router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), PushNotificationControllers.getAllPushNotifications)
router.post(
    '/send',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    // fileUploadHandler(),
    // parseAllFilesData({ fieldName: FOLDER_NAMES.IMAGE, forceSingle: true }),
    PushNotificationControllers.sendPushNotificationController,
);

export const PushNotificationRoutes = router;
