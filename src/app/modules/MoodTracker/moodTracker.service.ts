import { MOOD_TYPE, SOURCE } from "./moodTracker.constant";
import { TMoodTracker } from "./moodTracker.interface";
import { startOfDay, endOfDay } from "date-fns";
import { MoodTracker } from "./moodTracker.model";
import AppError from "../../errors/AppError";


const CreateOrUpdateMoodTrackerToDB = async (
    userId: string,
    payload: TMoodTracker
) => {

    const validSource = [SOURCE.HOME, SOURCE.SELF_ASSESSMENT];
    const validMoodType = [MOOD_TYPE.ANXITY, MOOD_TYPE.DEPRESSION, MOOD_TYPE.HAPPY, MOOD_TYPE.NO_MOTIVATION, MOOD_TYPE.PERSONALITY, MOOD_TYPE.SAD, MOOD_TYPE.SLEEPY, MOOD_TYPE.STRESSED];

    if (!validMoodType.includes(payload.moodType)) {
        throw new AppError(400, "Mood type is not a valid enum value");
    };

    if (!validSource.includes(payload.source)) {
        throw new AppError(400, "Source is not a valid enum value");
    };



    const titleMap: Record<MOOD_TYPE, string> = {
        [MOOD_TYPE.ANXITY]: "SEVERE ANXITY",
        [MOOD_TYPE.DEPRESSION]: "DEPRESSION",
        [MOOD_TYPE.HAPPY]: "HAPPY",
        [MOOD_TYPE.NO_MOTIVATION]: "NO MOTIVATION",
        [MOOD_TYPE.PERSONALITY]: "PERSONALITY",
        [MOOD_TYPE.SAD]: "SAD",
        [MOOD_TYPE.SLEEPY]: "SLEEPY",
        [MOOD_TYPE.STRESSED]: "STRESSED",
    };

    const title = titleMap[payload.moodType];


    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());


    const existing = await MoodTracker.findOne({
        userId,
        createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    if (existing) {

        existing.moodType = payload.moodType;
        existing.source = payload.source;
        existing.title = title;
        await existing.save();
        return existing;
    } else {

        const newMood = await MoodTracker.create({
            userId,
            title,
            moodType: payload.moodType,
            source: payload.source,
        });

        return newMood;
    }
};

const getMyMoodTrackerHistoriesFromDB = async (userId: string) => {
    const result = await MoodTracker.find({ userId });
    if (!result || result.length === 0) {
        return []
    };

    return result;
}

export const MoodTrackerServices = {
    CreateOrUpdateMoodTrackerToDB,
    getMyMoodTrackerHistoriesFromDB
}