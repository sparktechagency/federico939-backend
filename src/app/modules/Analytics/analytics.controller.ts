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


const getMonthlyUserStats = catchAsync(async (req, res) => {
    const { year } = req.query;

    const selectedYear = year ? Number(year) : undefined;

    const result = await AnalyticsServices.getMonthlyUserStatsFromDB(selectedYear);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully retrieved monthly stats",
        data:result,
    })

})

export const AnalyticsControllers = {
    getStats,
    getMonthlyUserStats,
}