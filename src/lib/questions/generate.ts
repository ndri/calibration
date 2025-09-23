import type { QuestionWithCategory } from '$lib/types';
import { generateCountryPopulationQuestion } from './countryPopulations';
import { generateHistoricalFiguresQuestion } from './historicalFigures';

const generateFunctions = {
	'Country Populations': generateCountryPopulationQuestion,
	'Historical Figures': generateHistoricalFiguresQuestion
};

type ExtraCategory = 'Scout Mindset';

export type Category = keyof typeof generateFunctions;

export type ExtendedCategory = Category | ExtraCategory;

export function getAllCategories() {
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
	const categories = selectedCategories ?? getAllCategories();

	const randomIndex = Math.floor(Math.random() * categories.length);
	const category = categories[randomIndex];
	return generateQuestionFromCategory(category);
}
