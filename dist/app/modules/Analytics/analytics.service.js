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
exports.AnalyticsServices = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const audio_model_1 = require("../AudioCollections/audio.model");
const blog_model_1 = require("../Blog/blog.model");
const doctor_model_1 = require("../Doctors/doctor.model");
const user_constant_1 = require("../User/user.constant");
const user_model_1 = require("../User/user.model");
const getStatsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const [userCount, blogCount, doctorCount, audioCount] = yield Promise.all([
        user_model_1.User.countDocuments({ status: user_constant_1.STATUS.ACTIVE, verified: true }),
        blog_model_1.Blog.countDocuments(),
        doctor_model_1.Doctor.countDocuments(),
        audio_model_1.Audio.countDocuments(),
    ]);
    const result = {
        totalUser: userCount,
        totalBlog: blogCount,
        totalDoctor: doctorCount,
        totalAudio: audioCount,
    };
    return result;
});
const getMonthlyUserStatsFromDB = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedYear = year || (0, dayjs_1.default)().year();
    const startOfYear = (0, dayjs_1.default)(`${selectedYear}-01-01`).startOf('year').toDate();
    const endOfYear = (0, dayjs_1.default)(`${selectedYear}-12-31`).endOf('year').toDate();
    const stats = yield user_model_1.User.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfYear, $lte: endOfYear },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$createdAt' } },
                totalUsers: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                month: '$_id.month',
                totalUsers: 1,
            },
        },
        { $sort: { month: 1 } },
    ]);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const result = monthNames.map((name, index) => {
        const found = stats.find((s) => s.month === index + 1);
        return {
            month: name,
            totalUsers: found ? found.totalUsers : 0,
        };
    });
    return result;
});
exports.AnalyticsServices = {
    getStatsFromDB,
    getMonthlyUserStatsFromDB,
};
