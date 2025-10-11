import historicalFigures from '$lib/data/historical_figures.json';
import type { Question } from '$lib/questions/questions';
import { chooseNearbyPair } from '$lib/utils/array';

type HistoricalFigure = (typeof historicalFigures)[number];

export const historicalFiguresQuestion = 'Which historical figure was born first?';

function yearToString(year: number): string {
	if (year < 0) {
		return `${Math.abs(year)} BCE`;
	} else {
		return `${year}`;
	}
}

function figureNameToHistoricalFigure(figureName: string) {
	return historicalFigures.find((figure) => figure.name === figureName);
}

export function generateHistoricalFiguresExplanation(
	earlierFigure: HistoricalFigure,
	laterFigure: HistoricalFigure
) {
	return `${earlierFigure.name} (${yearToString(earlierFigure.birthYear)}) was born before ${laterFigure.name} (${yearToString(laterFigure.birthYear)}).`;
}

export function historicalFiguresToExplanation(name1: string, name2: string) {
	const figure1 = figureNameToHistoricalFigure(name1);
	const figure2 = figureNameToHistoricalFigure(name2);

	if (!figure1 || !figure2) return;

	const [earlierFigure, laterFigure] = sortByBirthYear([figure1, figure2]);

	return generateHistoricalFiguresExplanation(earlierFigure, laterFigure);
}

function sortByBirthYear(figures: HistoricalFigure[]) {
	return [...figures].sort((a, b) => a.birthYear - b.birthYear);
}

export function generateHistoricalFiguresQuestion(): Question {
	const [figure1, figure2] = chooseNearbyPair(historicalFigures, (figure) => figure.birthYear);

	const [earlierFigure, laterFigure] = sortByBirthYear([figure1, figure2]);

	return {
		question: historicalFiguresQuestion,
		options: [figure1.name, figure2.name],
		answer: earlierFigure.name,
		explanation: generateHistoricalFiguresExplanation(earlierFigure, laterFigure)
	};
}
