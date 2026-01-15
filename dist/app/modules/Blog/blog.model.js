"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const blog_constant_1 = require("./blog.constant");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: Object.values(blog_constant_1.BLOG_CATEGORY),
        required: true,
    },
    categoryName: {
        type: String,
        required: false,
    },
    thumbnail: {
        type: String,
        required: true,
        default: '',
    },
    authorName: {
        type: String,
        required: true,
    },
    authorImage: {
        type: String,
        required: true,
    },
    isLatest: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Blog = (0, mongoose_1.model)('Blog', blogSchema);
