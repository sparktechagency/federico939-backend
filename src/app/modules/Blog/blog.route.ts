import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import { BlogControllers } from './blog.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import parseAllFilesData from '../../middlewares/parseAllFileData';
import { FOLDER_NAMES } from '../../enums/files';

const router = express.Router();

router.get("/latest", auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), BlogControllers.getLatestBlog)

router
    .route('/')
    .post(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        parseAllFilesData(
            { fieldName: FOLDER_NAMES.THUMBNAIL, forceSingle: true },
            { fieldName: FOLDER_NAMES.AUTHORIMAGE, forceSingle: true },
        ),
        BlogControllers.createBlog,
    )
    .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), BlogControllers.getAllBLogs);




router
    .route('/:id')
    .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), BlogControllers.getBlogById)
    .patch(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        parseAllFilesData(
            { fieldName: FOLDER_NAMES.THUMBNAIL, forceSingle: true },
            { fieldName: FOLDER_NAMES.AUTHORIMAGE, forceSingle: true },
        ),
        BlogControllers.updateBlogById,
    )
    .delete(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        BlogControllers.deleteBlogById,
    );

export const BlogRoutes = router;
