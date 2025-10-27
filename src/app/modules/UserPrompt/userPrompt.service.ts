import dayjs from "dayjs";
import { MoodTracker } from "../MoodTracker/moodTracker.model";
import { UserPrompt } from "./userPrompt.model";
import { SOURCE } from "../MoodTracker/moodTracker.constant";

// const checkPrompts = async (userId: string) => {
//     const today = dayjs().startOf("day");

//     const moodToday = await MoodTracker.findOne({
//         userId,
//         createdAt: {
//             $gte: today.toDate(),
//             $lte: today.endOf("day").toDate()
//         }
//     });

//     let showMoodModal = !moodToday;


//     let prompt = await UserPrompt.findOne({ userId });
//     if (!prompt) {

//         prompt = await UserPrompt.create({ userId, paymentModalCreatedAt: new Date() });
//     }

//     const daysSincePaymentCreated = today.diff(dayjs(prompt.paymentModalCreatedAt).startOf("day"), "day");
//     const showPaymentModal = (daysSincePaymentCreated % 7 === 0);

//     return { showMoodModal, showPaymentModal };
// };

const checkPrompts = async (userId: string) => {
    const today = dayjs().startOf("day");


    const moodToday = await MoodTracker.findOne({
        userId,
        source: SOURCE.HOME,
        createdAt: { $gte: today.toDate(), $lte: today.endOf("day").toDate() }
    });

    const showMoodModal = !moodToday;
    const moodData = moodToday || null;


    let prompt = await UserPrompt.findOne({ userId });
    if (!prompt) {
        prompt = await UserPrompt.create({ userId, paymentModalCreatedAt: today.toDate(), paymentModalIntervalDays: 7 });
    }

    let showPaymentModal = false;
    if (prompt.paymentModalCreatedAt) {
        const daysSince = today.diff(dayjs(prompt.paymentModalCreatedAt).startOf("day"), "day");
        showPaymentModal = (daysSince % (prompt.paymentModalIntervalDays || 7) === 0);
    }

    return {
        showMoodModal,
        moodData,
        showPaymentModal
    };
};

const updatePaymentIntervalToDB = async (userId: string, days: number) => {
    const result = await UserPrompt.findOneAndUpdate(
        { userId },
        { paymentModalIntervalDays: days },
        { new: true, upsert: true }
    );

    return result;
};




export const UserPromptServices = {
    checkPrompts,
    updatePaymentIntervalToDB
}