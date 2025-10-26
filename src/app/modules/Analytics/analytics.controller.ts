import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getStats = catchAsync(async (req, res) => {
    const result = await AnalyticsServices.getStatsFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully retrieved stats",
        data: result,
    })
});

export const AnalyticsControllers={
    getStats,
}