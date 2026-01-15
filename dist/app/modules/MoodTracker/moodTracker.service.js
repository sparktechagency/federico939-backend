"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodTrackerServices = void 0;
const moodTracker_constant_1 = require("./moodTracker.constant");
const date_fns_1 = require("date-fns");
const moodTracker_model_1 = require("./moodTracker.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const CreateOrUpdateMoodTrackerToDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const validSource = [moodTracker_constant_1.SOURCE.HOME, moodTracker_constant_1.SOURCE.SELF_ASSESSMENT];
    const validMoodType = [
        moodTracker_constant_1.MOOD_TYPE.ANXITY,
        moodTracker_constant_1.MOOD_TYPE.DEPRESSION,
        moodTracker_constant_1.MOOD_TYPE.HAPPY,
        moodTracker_constant_1.MOOD_TYPE.NO_MOTIVATION,
        moodTracker_constant_1.MOOD_TYPE.PERSONALITY,
        moodTracker_constant_1.MOOD_TYPE.SAD,
        moodTracker_constant_1.MOOD_TYPE.SLEEPY,
        moodTracker_constant_1.MOOD_TYPE.STRESSED,
    ];
    if (payload.moodType && !validMoodType.includes(payload.moodType)) {
        throw new AppError_1.default(400, 'Mood type is not a valid enum value');
    }
    if (payload.source && !validSource.includes(payload.source)) {
        throw new AppError_1.default(400, 'Source is not a valid enum value');
    }
    const titleMap = {
        [moodTracker_constant_1.MOOD_TYPE.ANXITY]: 'Severe Anxiety',
        [moodTracker_constant_1.MOOD_TYPE.DEPRESSION]: 'Depression',
        [moodTracker_constant_1.MOOD_TYPE.HAPPY]: 'Happy',
        [moodTracker_constant_1.MOOD_TYPE.NO_MOTIVATION]: 'No Motivation',
        [moodTracker_constant_1.MOOD_TYPE.PERSONALITY]: 'Personality',
        [moodTracker_constant_1.MOOD_TYPE.SAD]: 'Sad',
        [moodTracker_constant_1.MOOD_TYPE.SLEEPY]: 'Sleepy',
        [moodTracker_constant_1.MOOD_TYPE.STRESSED]: 'Stressed',
    };
    const title = payload.moodType ? titleMap[payload.moodType] : undefined;
    const todayStart = (0, date_fns_1.startOfDay)(new Date());
    const todayEnd = (0, date_fns_1.endOfDay)(new Date());
    const existing = yield moodTracker_model_1.MoodTracker.findOne({
        userId,
        createdAt: { $gte: todayStart, $lte: todayEnd },
    });
    if (payload.moodType && existing) {
        existing.moodType = payload.moodType;
        existing.source = payload.source;
        existing.title = title;
        yield existing.save();
        return existing;
    }
    if (payload.moodType) {
        const newMood = yield moodTracker_model_1.MoodTracker.create({
            userId,
            title,
            moodType: payload.moodType,
            source: payload.source,
        });
        return newMood;
    }
    return null;
});
const getMyMoodTrackerHistoriesFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = moodTracker_model_1.MoodTracker.find({ userId });
    const queryBuilder = new QueryBuilder_1.default(baseQuery, query)
        .search(['name', 'email', 'subject', 'userId'])
        .sort()
        .fields()
        .filter()
        .paginate();
    const result = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    if (!result || result.length === 0) {
        return {
            data: [],
            meta,
        };
    }
    const groupedData = result.reduce((acc, item) => {
        const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
        if (!acc[dateKey])
            acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
    }, {});
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date
            .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
            .replace(/ /g, ' ');
    };
    const formattedData = Object.keys(groupedData)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => ({
        date: formatDate(date),
        items: groupedData[date],
    }));
    return {
        data: formattedData,
        meta,
    };
});
const getAllMoodTrackerHistoriesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = moodTracker_model_1.MoodTracker.find().populate({
        path: 'userId',
        select: '_id name role profileImage',
    });
    const queryBuilder = new QueryBuilder_1.default(baseQuery, query)
        .search(['name email subject userId'])
        .sort()
        .fields()
        .filter()
        .paginate();
    const result = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    if (!result || result.length === 0) {
        return [];
    }
    return {
        data: result,
        meta,
    };
});
const deleteMoodTrackerHistoryByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield moodTracker_model_1.MoodTracker.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete mood tracker history by this ID');
    }
    return result;
});
exports.MoodTrackerServices = {
    CreateOrUpdateMoodTrackerToDB,
    getMyMoodTrackerHistoriesFromDB,
    getAllMoodTrackerHistoriesFromDB,
    deleteMoodTrackerHistoryByIdFromDB,
};
