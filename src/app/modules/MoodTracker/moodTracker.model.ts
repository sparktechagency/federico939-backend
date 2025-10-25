import { model, Schema } from "mongoose";
import { TMoodTracker } from "./moodTracker.interface";
import { MOOD_TYPE, SOURCE } from "./moodTracker.constant";

const moodTrackerSchema = new Schema<TMoodTracker>({
    title: {
        type: String,
        required: false,
    },
    moodType: {
        type: String,
        enum: Object.values(MOOD_TYPE),
    },
    source: {
        type: String,
        enum: Object.values(SOURCE)
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export const MoodTracker = model("MoodTracker", moodTrackerSchema);