"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeScore = exports.loadQuestionnaire = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ----------Load Questionnaire Data ----------
function loadQuestionnaire(categoryKey) {
    const map = {
        anxiety: 'anxiety.json',
        depression: 'depression.json',
        stress: 'stress.json',
        personality: 'personality.json',
    };
    const file = map[categoryKey.toLowerCase()];
    if (!file) {
        throw new Error('Invalid category');
    }
    const filePath = path_1.default.join(process.cwd(), 'data', file);
    const json = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(json);
}
exports.loadQuestionnaire = loadQuestionnaire;
// ----------Compute Score-----------
function computeScore(categoryKey, payloadAnswers) {
    const questionnaire = loadQuestionnaire(categoryKey);
    const qaById = new Map(questionnaire.questions.map((q) => [q.id, q]));
    let total = 0;
    const answers = [];
    let traits = null;
    const cat = categoryKey.toLowerCase();
    if (cat === 'personality') {
        traits = {
            Openness: 0,
            Conscientiousness: 0,
            Extraversion: 0,
            Agreeableness: 0,
            Neuroticism: 0,
        };
    }
    for (const ans of payloadAnswers) {
        const meta = qaById.get(ans.questionId);
        if (!meta) {
            throw new Error(`Question ID ${ans.questionId} not found in ${categoryKey}`);
        }
        // Determine score from answer or option
        let score = typeof ans.score === 'number' ? ans.score : null;
        if (score === null) {
            const option = questionnaire.options.find((opt) => opt.score === ans.selectedOption);
            if (!option) {
                throw new Error(`Invalid option selected for question ID ${ans.questionId} invalid for ${categoryKey}`);
            }
            score = option.score;
        }
        // Handle reverse scoring
        if (meta.reverseScored) {
            score = 4 - score;
        }
        total += score;
        const answeRec = {
            questionId: ans.questionId,
            question: meta.question,
            selectedOption: ans.selectedOption,
            score,
            extra: {},
        };
        if (cat === 'personality' && traits) {
            answeRec.extra = {
                trait: meta.trait,
                reverseScored: !!meta.reverseScored,
            };
            if (meta.trait) {
                traits[meta.trait] += score;
            }
        }
        answers.push(answeRec);
    }
    let label = '';
    let interpretation = '';
    if (cat === 'personality' && traits) {
        const entries = Object.entries(traits).sort((a, b) => b[1] - a[1]);
        const predominant = entries[0][0];
        label = predominant;
        interpretation = questionnaire.scoring.interpretations[predominant];
    }
    else {
        const ranges = questionnaire.scoring.ranges;
        if (!ranges) {
            throw new Error('Scoring ranges not defined');
        }
        const hit = ranges.find((r) => total >= r.min && total <= r.max);
        if (!hit) {
            throw new Error('Score out of range');
        }
        label = hit.label;
        interpretation = questionnaire.scoring.interpretations[label] || '';
    }
    return {
        totalScore: total,
        resultLabel: label,
        interpretation,
        answers,
        traits: traits || undefined,
    };
}
exports.computeScore = computeScore;
