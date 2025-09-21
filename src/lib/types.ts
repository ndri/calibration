import type { Category } from './questions/generate';

export interface Question {
	question: string;
	options: string[];
	answer: string;
	explanation?: string;
}

export type QuestionWithSet = Question & { questionSet: Category | 'Scout Mindset' };
