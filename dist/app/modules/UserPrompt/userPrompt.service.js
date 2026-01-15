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
exports.UserPromptServices = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const moodTracker_model_1 = require("../MoodTracker/moodTracker.model");
const userPrompt_model_1 = require("./userPrompt.model");
const moodTracker_constant_1 = require("../MoodTracker/moodTracker.constant");
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
const checkPrompts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, dayjs_1.default)().startOf('day');
    const moodToday = yield moodTracker_model_1.MoodTracker.findOne({
        userId,
        source: moodTracker_constant_1.SOURCE.HOME,
        createdAt: { $gte: today.toDate(), $lte: today.endOf('day').toDate() },
    });
    const showMoodModal = !moodToday;
    const moodData = moodToday || null;
    let prompt = yield userPrompt_model_1.UserPrompt.findOne({ userId });
    if (!prompt) {
        prompt = yield userPrompt_model_1.UserPrompt.create({
            userId,
            paymentModalCreatedAt: today.toDate(),
            paymentModalIntervalDays: 7,
        });
    }
    let showPaymentModal = false;
    if (prompt.paymentModalCreatedAt) {
        const daysSince = today.diff((0, dayjs_1.default)(prompt.paymentModalCreatedAt).startOf('day'), 'day');
        showPaymentModal = daysSince % (prompt.paymentModalIntervalDays || 7) === 0;
    }
    return {
        showMoodModal,
        moodData,
        showPaymentModal,
    };
});
const updatePaymentIntervalToDB = (userId, days) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userPrompt_model_1.UserPrompt.findOneAndUpdate({ userId }, { paymentModalIntervalDays: days }, { new: true, upsert: true });
    return result;
});
exports.UserPromptServices = {
    checkPrompts,
    updatePaymentIntervalToDB,
};
