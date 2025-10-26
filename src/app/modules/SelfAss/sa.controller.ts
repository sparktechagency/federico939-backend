import path from 'path';
import fs from 'fs';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { computeScore, loadQuestionnaire } from '../../utils/scoring';
import { ISelfAssessment } from './sa.interface';
import SelfAssessmentModel from './sa.model';
import { MoodTracker } from '../MoodTracker/moodTracker.model';
import { SOURCE } from '../MoodTracker/moodTracker.constant';

const getCategories = catchAsync(async (req: Request, res: Response) => {
  try {
    const p = path.resolve(process.cwd(), 'data', 'categories.json');

    const json = JSON.parse(fs.readFileSync(p, 'utf-8'));
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Categories retrieved successfully',
      data: json,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve categories',
      data: null,
    });
  }
});

//  GET /api/self-assessment/:category
const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = req.params.category.toLowerCase();
    const data = loadQuestionnaire(cat);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/self-assessment/:category/submit
// body: { answers: [{ questionId, selectedOption, score? }] }
const submitAssessment = async (req: Request, res: Response): Promise<void> => {
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

    const result = computeScore(cat, answers);

    const doc: ISelfAssessment = await SelfAssessmentModel.create({
      userId,
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      totalScore: result.totalScore,
      resultLabel: result.resultLabel,
      interpretation: result.interpretation,
      answers: result.answers,
      traits: result.traits || undefined,
    });

    await MoodTracker.create({
      userId,
      category: doc.category,
      resultLabel: doc.resultLabel,
      source: SOURCE.SELF_ASSESSMENT,
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/self-assessment/history?category=Anxiety
const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const filter: Record<string, any> = { userId };
    if (req.query.category) filter.category = req.query.category;

    const items = await SelfAssessmentModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const SelfAssController = {
  getCategories,
  getQuestions,
  submitAssessment,
  getHistory,
};
