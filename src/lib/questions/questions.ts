import animalFacts from '$lib/data/animal_facts.json';
import scienceFacts from '$lib/data/science_facts.json';
import historyFacts from '$lib/data/history_facts.json';
import scoutMindsetQuestions from '$lib/data/scout_mindset_questions.json';
import { countriesToExplanation, countryPopulationsQuestion } from './countryPopulations';
import { historicalFiguresQuestion, historicalFiguresToExplanation } from './historicalFigures';

const answerSeparator = '|';

const specialCategories = ['Country Populations', 'Historical Figures'] as const;

const factCategories = ['Animal Facts', 'Science Facts', 'History Facts'] as const;

const extraCategories = ['Scout Mindset'] as const;

export const categories = [...factCategories, ...specialCategories] as const;

export type Category = (typeof categories)[number];

type ExtraCategory = (typeof extraCategories)[number];

export type ExtendedCategory = Category | ExtraCategory;

export interface Question {
	question: string;
	options: string[];
	answer: string;
	explanation?: string;
	source?: string;
}

export type QuestionWithCategory = Question & { questionSet: ExtendedCategory };

const allQuestions = [
	...animalFacts,
	...scienceFacts,
	...historyFacts,
	...scoutMindsetQuestions
] as const;

const questionStringToExplanationMap = new Map<string, string>(
	allQuestions
		.map((question) => {
			if (!question.explanation) return;

			return [questionToString(question), question.explanation] as const;
		})
		.filter((item) => item !== undefined)
);

export function getCategories() {
	const sorted = [...categories].sort((a, b) => a.localeCompare(b));
	return sorted as Category[];
}

export function getExtendedCategories() {
	return [...getCategories(), ...extraCategories];
}

export function generateQuestionString(question: string, options: string[]) {
	return [question, ...options].join(answerSeparator);
}

export function questionToString(question: Question) {
	return generateQuestionString(question.question, question.options);
}

export function getExplanation(question: string, options: string[]) {
	const explanation = questionStringToExplanationMap.get(generateQuestionString(question, options));

	if (explanation) return explanation;

	if (question === countryPopulationsQuestion) {
		return countriesToExplanation(options[0], options[1]);
	}

	if (question === historicalFiguresQuestion) {
		return historicalFiguresToExplanation(options[0], options[1]);
	}
}
