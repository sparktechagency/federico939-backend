import { Types } from "mongoose";

export interface TBlogBookmark {
    userId: Types.ObjectId;
    referenceId: Types.ObjectId;
}
