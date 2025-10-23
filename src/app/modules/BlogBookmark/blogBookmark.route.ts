import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { BookmarkValidation } from "./blogBookmark.validation";
import { BlogBookmarkControllers } from "./blogBookmark.controller";

const router = express.Router();

router.post(
  "/toggle",
  auth(USER_ROLES.USER),
  validateRequest(BookmarkValidation.toggleBookmark),
  BlogBookmarkControllers.toggleBlogBookmark,
);

router.get("/", auth(USER_ROLES.USER), BlogBookmarkControllers.getBlogBookmark);

router.delete(
  "/:referenceId",
  auth(USER_ROLES.USER),
  BlogBookmarkControllers.deleteBlogBookmarkByID,
);

export const BlogBookmarkRoutes = router;
