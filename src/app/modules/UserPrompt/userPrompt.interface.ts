import { Types } from "mongoose";

export type TUserPrompt = {
    userId: Types.ObjectId;
    showMoodModal: boolean;
    showPaymentModal: boolean;
    paymentModalCreatedAt?: string;
    paymentModalIntervalDays?: number;
}