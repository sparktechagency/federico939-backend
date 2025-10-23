import { Schema, model } from "mongoose";
import { TBlogBookmark } from "./blogBookmark.interface";

const blogBookmarkSchema = new Schema<TBlogBookmark>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        referenceId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Blog",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const BookmarkEvent = model<TBlogBookmark>("BlogBookmark", blogBookmarkSchema);
