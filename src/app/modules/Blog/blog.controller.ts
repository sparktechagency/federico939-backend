import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogServices } from "./blog.service";

const createBlog = catchAsync(async (req, res) => {
    const blogData = req.body;
    const result = await BlogServices.createBlogToDB(blogData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Blog data is created successfully",
        data: result,
    })
});

const getAllBLogs = catchAsync(async (req, res) => {
    const result = await BlogServices.getAllBLogsFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully retrieved blogs data",
        data: result,
    })
})

export const BlogControllers = {
    createBlog,
    getAllBLogs,
}