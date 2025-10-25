import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../enums/user";
import { MoodTrackerControllers } from "./moodTracker.controller";

const router = express.Router();

router.route("/")
    .post(auth(USER_ROLES.USER), MoodTrackerControllers.CreateOrUpdateMoodTracker)

export const MoodTrackerRoutes = router;