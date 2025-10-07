import countryPopulations from '$lib/data/country_populations.json';
import historicalFigures from '$lib/data/historical_figures.json';
import animalFacts from '$lib/data/animal_facts.json';
import scienceFacts from '$lib/data/science_facts.json';
import historyFacts from '$lib/data/history_facts.json';

const extraCategories = ['Scout Mindset'] as const;

type ExtraCategory = (typeof extraCategories)[number];

export type Category = keyof typeof questions;

export type ExtendedCategory = Category | ExtraCategory;

export interface Question {
	question: string;
	options: string[];
	answer: string;
	explanation?: string;
	source?: string;
}

export type QuestionWithCategory = Question & { questionSet: ExtendedCategory };

export const questions = {
	'Country Populations': countryPopulations,
	'Historical Figures': historicalFigures,
	'Animal Facts': animalFacts,
	'Science Facts': scienceFacts,
	'History Facts': historyFacts
};

export function getCategories() {
	const keys = Object.keys(questions);
	const sorted = keys.sort((a, b) => a.localeCompare(b));
	return sorted as Category[];
}

export function getExtendedCategories() {
	return [...getCategories(), ...extraCategories];
}

export function generateQuestionString(question: string, ...options: string[]) {
	const optionsString = [...options].sort((a, b) => a.localeCompare(b)).join();
	return question + optionsString;
}

export function questionToString(question: Question) {
	return generateQuestionString(question.question, ...question.options);
}
