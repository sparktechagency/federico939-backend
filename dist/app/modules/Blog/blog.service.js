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
exports.BlogServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const notificationHelper_1 = require("../../helpers/notificationHelper");
const blogBookmark_model_1 = require("../BlogBookmark/blogBookmark.model");
const notification_constant_1 = require("../Notification/notification.constant");
const user_constant_1 = require("../User/user.constant");
const user_model_1 = require("../User/user.model");
const blog_constant_1 = require("./blog.constant");
const blog_model_1 = require("./blog.model");
const createBlogToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const validCategories = [
        blog_constant_1.BLOG_CATEGORY.ANXITY_BLOG,
        blog_constant_1.BLOG_CATEGORY.FEAR_BLOG,
        blog_constant_1.BLOG_CATEGORY.PRODUCTIVITY_BLOG,
        blog_constant_1.BLOG_CATEGORY.SLEEP_BLOG,
        blog_constant_1.BLOG_CATEGORY.STRESS_BLOG,
    ];
    if (!validCategories.includes(payload.category)) {
        throw new AppError_1.default(400, "Category must'be valid enum values");
    }
    const categoryMap = {
        [blog_constant_1.BLOG_CATEGORY.ANXITY_BLOG]: 'Anxity',
        [blog_constant_1.BLOG_CATEGORY.FEAR_BLOG]: 'Fear',
        [blog_constant_1.BLOG_CATEGORY.PRODUCTIVITY_BLOG]: 'Productivity',
        [blog_constant_1.BLOG_CATEGORY.SLEEP_BLOG]: 'Sleep',
        [blog_constant_1.BLOG_CATEGORY.STRESS_BLOG]: 'Stress',
    };
    const categoryName = categoryMap[payload.category];
    payload.categoryName = categoryName;
    const result = yield blog_model_1.Blog.create(payload);
    const users = yield user_model_1.User.find({ verified: true, status: user_constant_1.STATUS.ACTIVE }, '_id');
    yield Promise.all(users.map((user) => (0, notificationHelper_1.sendNotifications)({
        receiver: user._id,
        text: 'New blog published!',
        message: `${result.title} is now available to read.`,
        type: notification_constant_1.NOTIFICATION_TYPE.USER,
        data: result,
    })));
    if (!result) {
        throw new AppError_1.default(400, 'Failed to create blog');
    }
    return result;
});
const getLatestBlogFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findOne({ isLatest: true }).sort('-createdAt');
    if (!blog) {
        return null;
    }
    const isBookmarked = yield blogBookmark_model_1.BlogBookmark.exists({
        userId,
        referenceId: blog._id,
    });
    return Object.assign(Object.assign({}, blog.toObject()), { isBookmarked: !!isBookmarked });
});
const getAllBLogsFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = blog_model_1.Blog.find({ isLatest: false });
    const queryBuilder = new QueryBuilder_1.default(baseQuery, query)
        .search(['title', 'authorName', 'category'])
        .sort()
        .fields()
        .filter()
        .paginate();
    const blogs = yield queryBuilder.modelQuery.lean();
    const meta = yield queryBuilder.countTotal();
    if (!blogs || blogs.length === 0) {
        return [];
    }
    const withBookmark = yield Promise.all(blogs.map((blog) => __awaiter(void 0, void 0, void 0, function* () {
        const isBookmarked = yield blogBookmark_model_1.BlogBookmark.exists({
            userId,
            referenceId: blog._id,
        });
        return Object.assign(Object.assign({}, blog), { isBookmarked: !!isBookmarked });
    })));
    return {
        data: withBookmark,
        meta,
    };
});
const getBlogByIdFromDB = (userId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findById(id).lean();
    const isBookmarked = yield blogBookmark_model_1.BlogBookmark.exists({
        userId,
        referenceId: id,
    });
    if (!blog) {
        return {};
    }
    return Object.assign(Object.assign({}, blog), { isBookmarked: !!isBookmarked });
});
const updateBlogByIdToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.category) {
        const validCategories = [
            blog_constant_1.BLOG_CATEGORY.ANXITY_BLOG,
            blog_constant_1.BLOG_CATEGORY.FEAR_BLOG,
            blog_constant_1.BLOG_CATEGORY.PRODUCTIVITY_BLOG,
            blog_constant_1.BLOG_CATEGORY.SLEEP_BLOG,
            blog_constant_1.BLOG_CATEGORY.STRESS_BLOG,
        ];
        if (!validCategories.includes(payload.category)) {
            throw new AppError_1.default(400, 'Category must be one of the valid enum values');
        }
        const categoryMap = {
            [blog_constant_1.BLOG_CATEGORY.ANXITY_BLOG]: 'Anxity',
            [blog_constant_1.BLOG_CATEGORY.FEAR_BLOG]: 'Fear',
            [blog_constant_1.BLOG_CATEGORY.PRODUCTIVITY_BLOG]: 'Productivity',
            [blog_constant_1.BLOG_CATEGORY.SLEEP_BLOG]: 'Sleep',
            [blog_constant_1.BLOG_CATEGORY.STRESS_BLOG]: 'Stress',
        };
        payload.categoryName = categoryMap[payload.category];
    }
    const updatedBlog = yield blog_model_1.Blog.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!updatedBlog) {
        throw new AppError_1.default(404, 'No blog found or failed to update');
    }
    return updatedBlog;
});
const deleteBlogByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete this blog by ID');
    }
    return result;
});
exports.BlogServices = {
    createBlogToDB,
    getAllBLogsFromDB,
    getBlogByIdFromDB,
    updateBlogByIdToDB,
    deleteBlogByIdFromDB,
    getLatestBlogFromDB,
};
