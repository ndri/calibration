import type { Question, QuestionWithCategory } from '$lib/types';
import { generateCountryPopulationQuestion } from './countryPopulations';
import { generateHistoricalFiguresQuestion } from './historicalFigures';
import animalFacts from '$lib/data/animal_facts.json';
import scienceFacts from '$lib/data/science_facts.json';

const generateFunctions = {
	'Country Populations': generateCountryPopulationQuestion,
	'Historical Figures': generateHistoricalFiguresQuestion,
	'Animal Facts': () => chooseQuestion(animalFacts, 'Animal Facts'),
	'Science Facts': () => chooseQuestion(scienceFacts, 'Science Facts')
};

const extraCategories = ['Scout Mindset'] as const;

type ExtraCategory = (typeof extraCategories)[number];

export type Category = keyof typeof generateFunctions;

export type ExtendedCategory = Category | ExtraCategory;

export function getCategories() {
	return Object.keys(generateFunctions) as Category[];
}

function generateQuestionFromCategory(category: Category): QuestionWithCategory {
	const generateFunction = generateFunctions[category];
	if (!generateFunction) {
		throw new Error(`No question generator found for category: ${category}`);
	}
	return { ...generateFunction(), questionSet: category };
}

export function generateQuestion(selectedCategories?: Category[]) {
	const categories = selectedCategories ?? getCategories();

	const randomIndex = Math.floor(Math.random() * categories.length);
	const category = categories[randomIndex];
	return generateQuestionFromCategory(category);
}

function chooseQuestion(questions: Question[], categoryName: Category): QuestionWithCategory {
	const randomIndex = Math.floor(Math.random() * questions.length);
	const question = questions[randomIndex];
	return { ...question, questionSet: categoryName };
}

export function getExtendedCategories() {
	return [...getCategories(), ...extraCategories];
}
