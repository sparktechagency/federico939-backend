"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const blog_service_1 = require("./blog.service");
const createBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogData = req.body;
    const result = yield blog_service_1.BlogServices.createBlogToDB(blogData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Blog data is created successfully',
        data: result,
    });
}));
const getAllBLogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const result = yield blog_service_1.BlogServices.getAllBLogsFromDB(userId, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully retrieved are blogs data',
        data: result,
    });
}));
const getLatestBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const result = yield blog_service_1.BlogServices.getLatestBlogFromDB(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully retrieved latest blog data',
        data: result,
    });
}));
const getBlogById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { id: userId } = req.user;
    const result = yield blog_service_1.BlogServices.getBlogByIdFromDB(userId, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Successfully retrieved blog data',
        data: result,
    });
}));
const updateBlogById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedData = req.body;
    const result = yield blog_service_1.BlogServices.updateBlogByIdToDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Blog data is updated successfully',
        data: result,
    });
}));
const deleteBlogById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blog_service_1.BlogServices.deleteBlogByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Blog data is deleted successfully',
        data: result,
    });
}));
exports.BlogControllers = {
    createBlog,
    getAllBLogs,
    getBlogById,
    updateBlogById,
    deleteBlogById,
    getLatestBlog,
};
