import { Types } from "mongoose";
import { MOOD_TYPE, SOURCE } from "./moodTracker.constant";

export interface TMoodTracker {
    userId:Types.ObjectId;
    title?: string;
    moodType: MOOD_TYPE;
    source: SOURCE;
    category?:string
    resultLabel?:string;
}