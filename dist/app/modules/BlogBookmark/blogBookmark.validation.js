"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkValidation = void 0;
const zod_1 = require("zod");
const toggleBookmark = zod_1.z.object({
    body: zod_1.z.object({
        referenceId: zod_1.z.string({
            required_error: 'Reference ID is required',
        }),
    }),
});
exports.BookmarkValidation = {
    toggleBookmark,
};
