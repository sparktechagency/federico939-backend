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
exports.SelfAssController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const scoring_1 = require("../../utils/scoring");
const sa_model_1 = __importDefault(require("./sa.model"));
const moodTracker_model_1 = require("../MoodTracker/moodTracker.model");
const moodTracker_constant_1 = require("../MoodTracker/moodTracker.constant");
const getCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const p = path_1.default.resolve(process.cwd(), 'data', 'categories.json');
        const json = JSON.parse(fs_1.default.readFileSync(p, 'utf-8'));
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: 'Categories retrieved successfully',
            data: json,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: 'Failed to retrieve categories',
            data: null,
        });
    }
}));
//  GET /api/self-assessment/:category
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cat = req.params.category.toLowerCase();
        const data = (0, scoring_1.loadQuestionnaire)(cat);
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// POST /api/self-assessment/:category/submit
// body: { answers: [{ questionId, selectedOption, score? }] }
const submitAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        // depends on auth middleware
        console.log('User ID:', userId);
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const cat = req.params.category.toLowerCase();
        const answers = req.body.answers || [];
        if (!Array.isArray(answers) || answers.length === 0) {
            res.status(400).json({ message: 'answers array required' });
            return;
        }
        const result = (0, scoring_1.computeScore)(cat, answers);
        const doc = yield sa_model_1.default.create({
            userId,
            category: cat.charAt(0).toUpperCase() + cat.slice(1),
            totalScore: result.totalScore,
            resultLabel: result.resultLabel,
            interpretation: result.interpretation,
            answers: result.answers,
            traits: result.traits || undefined,
        });
        yield moodTracker_model_1.MoodTracker.create({
            userId,
            category: doc.category,
            resultLabel: doc.resultLabel,
            source: moodTracker_constant_1.SOURCE.SELF_ASSESSMENT,
        });
        res.status(201).json({
            id: doc._id,
            userId,
            category: doc.category,
            totalScore: doc.totalScore,
            resultLabel: doc.resultLabel,
            interpretation: doc.interpretation,
            traits: doc.traits,
            createdAt: doc.createdAt,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// GET /api/self-assessment/history?category=Anxiety
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const filter = { userId };
        if (req.query.category)
            filter.category = req.query.category;
        const items = yield sa_model_1.default.find(filter)
            .sort({ createdAt: -1 })
            .lean();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.SelfAssController = {
    getCategories,
    getQuestions,
    submitAssessment,
    getHistory,
};
