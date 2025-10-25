import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MoodTrackerServices } from "./moodTracker.service";

const CreateOrUpdateMoodTracker = catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    const moodTrackerData = req.body;
    const result = await MoodTrackerServices.CreateOrUpdateMoodTrackerToDB(userId, moodTrackerData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully create or update mood tracker data",
        data: result,
    })
});

export const MoodTrackerControllers={
    CreateOrUpdateMoodTracker,
}