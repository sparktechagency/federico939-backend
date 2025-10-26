import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

const createBlog = catchAsync(async (req, res) => {
    const blogData = req.body;
    const result = await BlogServices.createBlogToDB(blogData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blog data is created successfully',
        data: result,
    });
});

const getAllBLogs = catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    const result = await BlogServices.getAllBLogsFromDB(userId, req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully retrieved are blogs data',
        data: result,
    });
});

const getLatestBlog = catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    const result = await BlogServices.getLatestBlogFromDB(userId);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Successfully retrieved latest blog data",
        data: result,
    })
})

const getBlogById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const result = await BlogServices.getBlogByIdFromDB(userId, id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully retrieved blog data',
        data: result,
    });
});

const updateBlogById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await BlogServices.updateBlogByIdToDB(id, updatedData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blog data is updated successfully',
        data: result,
    });
});

const deleteBlogById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BlogServices.deleteBlogByIdFromDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blog data is deleted successfully',
        data: result,
    });
});

export const BlogControllers = {
    createBlog,
    getAllBLogs,
    getBlogById,
    updateBlogById,
    deleteBlogById,
    getLatestBlog,
};
