import { Types } from "mongoose";

export interface TBookmark {
    userId: Types.ObjectId;
    referenceId: Types.ObjectId;
}
