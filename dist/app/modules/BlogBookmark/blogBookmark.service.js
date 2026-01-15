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
exports.BlogBookmarkServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blogBookmark_model_1 = require("./blogBookmark.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const checkBlogBookmarkStatus = (userId, referenceId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmark = yield blogBookmark_model_1.BlogBookmark.findOne({
        userId,
        referenceId,
    });
    return { isBookmarked: !!bookmark };
});
const toggleBlogBookmark = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, referenceId } = payload;
    const existingBookmark = yield blogBookmark_model_1.BlogBookmark.findOne({
        userId,
        referenceId,
    });
    if (existingBookmark) {
        yield blogBookmark_model_1.BlogBookmark.deleteOne({ _id: existingBookmark._id });
        return {
            message: 'Bookmark removed successfully',
            isBookmarked: false,
        };
    }
    else {
        const newBookmark = yield blogBookmark_model_1.BlogBookmark.create({
            userId,
            referenceId: new mongoose_1.default.Types.ObjectId(referenceId),
        });
        return {
            message: 'Bookmark added successfully',
            isBookmarked: true,
            data: newBookmark,
        };
    }
});
const getBlogBookmarkFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { userId };
    const bookmarks = yield blogBookmark_model_1.BlogBookmark.find(query)
        .populate({
        path: 'userId',
        select: 'name email profileImage role _id',
    })
        .populate('referenceId')
        .sort({ createdAt: -1 })
        .lean();
    const populatedBookmarks = yield Promise.all(bookmarks.map((bookmark) => __awaiter(void 0, void 0, void 0, function* () {
        const isBookmarked = yield checkBlogBookmarkStatus(userId, bookmark.referenceId);
        return Object.assign(Object.assign({}, bookmark), { isBookmarked: isBookmarked.isBookmarked });
    })));
    return populatedBookmarks;
});
const deleteBlogBookmarkByIdFromDB = (userId, referenceId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogBookmark_model_1.BlogBookmark.deleteOne({
        userId,
        referenceId,
    });
    if (!result.deletedCount) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Bookmark not found');
    }
    return result;
});
exports.BlogBookmarkServices = {
    toggleBlogBookmark,
    getBlogBookmarkFromDB,
    deleteBlogBookmarkByIdFromDB,
};
