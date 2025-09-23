import type { ExtendedCategory } from './questions/generate';

export interface Question {
	question: string;
	options: string[];
	answer: string;
	explanation?: string;
}

export type QuestionWithCategory = Question & { questionSet: ExtendedCategory };
