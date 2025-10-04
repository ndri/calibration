import historicalFigures from '$lib/data/historical_figures.json';
import type { Question } from '$lib/types';
import { chooseNearbyPair } from '$lib/utils/array';

function yearToString(year: number): string {
	if (year < 0) {
		return `${Math.abs(year)} BCE`;
	} else {
		return `${year}`;
	}
}

export function generateHistoricalFiguresQuestion(): Question {
	const [figure1, figure2] = chooseNearbyPair(historicalFigures, (figure) => figure.birthYear);

	const [earlierFigure, laterFigure] =
		figure1.birthYear < figure2.birthYear ? [figure1, figure2] : [figure2, figure1];

	return {
		question: 'Which historical figure was born first?',
		options: [figure1.name, figure2.name],
		answer: earlierFigure.name,
		explanation: `${earlierFigure.name} (${yearToString(earlierFigure.birthYear)}) was born before ${laterFigure.name} (${yearToString(laterFigure.birthYear)}).`
	};
}
