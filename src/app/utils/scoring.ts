import fs from 'fs';
import path from 'path';

export interface Option {
  text: string;
  score: number;
}

export interface Question {
  id: number;
  question: string;
  reverseScored?: boolean;
  trait?: string;
}

export interface Range {
  min: number;
  max: number;
  label: string;
}

export interface Scoring {
  type: string;
  reverseRule?: string;
  totalMin?: number;
  totalMax?: number;
  ranges: Range[];
  interpretations: Record<string, string>;
}

export interface Questionnaire {
  category: string;
  version: string;
  questionType: string;
  options: Option[];
  questions: Question[];
  scoring: Scoring;
}

export interface AnswerPayload {
  questionId: number;
  selectedOption: number;
  score: number;
}

export interface ComputedResult {
  totalScore: number;
  resultLabel: string;
  interpretation: string;
  answers: {
    questionId: number;
    question: string;
    selectedOption: number;
    score: number;
    extra?: Record<string, unknown>;
  }[];
  traits?: Record<string, number>;
}

// ----------Load Questionnaire Data ----------

export function loadQuestionnaire(categoryKey: string): Questionnaire {
  const map: Record<string, string> = {
    anxiety: 'anxiety.json',
    depression: 'depression.json',
    stress: 'stress.json',
    personality: 'personality.json',
  };

  const file = map[categoryKey.toLowerCase()];
  if (!file) {
    throw new Error('Invalid category');
  }

  const filePath = path.join(process.cwd(), 'data', file);
  const json = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(json) as Questionnaire;
}

// ----------Compute Score-----------

export function computeScore(
  categoryKey: string,
  payloadAnswers: AnswerPayload[],
): ComputedResult {
  const questionnaire = loadQuestionnaire(categoryKey);
  const qaById = new Map<number, Question>(
    questionnaire.questions.map((q) => [q.id, q]),
  );
  let total = 0;
  const answers: ComputedResult['answers'] = [];
  let traits: Record<string, number> | null = null;

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
      throw new Error(
        `Question ID ${ans.questionId} not found in ${categoryKey}`,
      );
    }
    // Determine score from answer or option
    let score: number | null = typeof ans.score === 'number' ? ans.score : null;
    if (score === null) {
      const option = questionnaire.options.find(
        (opt) => opt.score === ans.selectedOption,
      );
      if (!option) {
        throw new Error(
          `Invalid option selected for question ID ${ans.questionId} invalid for ${categoryKey}`,
        );
      }

      score = option.score;
    }
    // Handle reverse scoring
    if (meta.reverseScored) {
      score = 4 - score;
    }
    total += score;

    const answeRec: ComputedResult['answers'][number] = {
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
  } else {
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
