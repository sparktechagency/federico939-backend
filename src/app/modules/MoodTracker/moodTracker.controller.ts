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

const getMyMoodTrackerHistories = catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    const result = await MoodTrackerServices.getMyMoodTrackerHistoriesFromDB(userId);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully get my mood tracker histories",
        data: result,
    })
})

const getAllMoodTrackerHistories = catchAsync(async (req, res) => {
    const result = await MoodTrackerServices.getAllMoodTrackerHistoriesFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully get all mood tracker histories",
        data: result,
    })
})

const deleteMoodTrackerHistoryById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MoodTrackerServices.deleteMoodTrackerHistoryByIdFromDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully delete mood tracker by this ID",
        data: result,
    })
})

export const MoodTrackerControllers = {
    CreateOrUpdateMoodTracker,
    getMyMoodTrackerHistories,
    getAllMoodTrackerHistories,
    deleteMoodTrackerHistoryById,
}