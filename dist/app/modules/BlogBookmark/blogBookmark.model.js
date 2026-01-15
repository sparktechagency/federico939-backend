"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogBookmark = void 0;
const mongoose_1 = require("mongoose");
const blogBookmarkSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    referenceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.BlogBookmark = (0, mongoose_1.model)('BlogBookmark', blogBookmarkSchema);
