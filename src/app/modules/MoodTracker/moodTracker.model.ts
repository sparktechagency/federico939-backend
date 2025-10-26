import { model, Schema, Types } from "mongoose";
import { TMoodTracker } from "./moodTracker.interface";
import { MOOD_TYPE, SOURCE } from "./moodTracker.constant";

const moodTrackerSchema = new Schema<TMoodTracker>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
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
    },
    category: {
        type: String,
        required: false,
    },
    resultLabel: {
        type: String,
        required: false,
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export const MoodTracker = model("MoodTracker", moodTrackerSchema);