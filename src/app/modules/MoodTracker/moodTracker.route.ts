import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../enums/user";
import { MoodTrackerControllers } from "./moodTracker.controller";

const router = express.Router();

router.route("/")
    .post(auth(USER_ROLES.USER), MoodTrackerControllers.CreateOrUpdateMoodTracker)
    .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), MoodTrackerControllers.getAllMoodTrackerHistories)

router.delete("/:id", MoodTrackerControllers.deleteMoodTrackerHistoryById)


router.get("/my", auth(USER_ROLES.USER), MoodTrackerControllers.getMyMoodTrackerHistories)

export const MoodTrackerRoutes = router;