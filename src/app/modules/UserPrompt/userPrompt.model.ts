import { model, Schema } from "mongoose";
import { TUserPrompt } from "./userPrompt.interface";

const userPromptSchema = new Schema<TUserPrompt>({
    showMoodModal: {
        type: Boolean,
        required: false,
    },
    showPaymentModal: {
        type: Boolean,
        required: false,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);


export const UserPrompt = model("UserPrompt", userPromptSchema)