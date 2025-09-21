import historicalFigures from '$lib/data/historical_figures.json';
import type { Question } from '$lib/types';

function yearToString(year: number): string {
	if (year < 0) {
		return `${Math.abs(year)} BCE`;
	} else {
		return `${year}`;
	}
}

export function generateHistoricalFiguresQuestion(): Question {
	const figuresClone = [...historicalFigures];

	const index1 = Math.floor(Math.random() * figuresClone.length);
	const figure1 = figuresClone.splice(index1, 1)[0];

	const figuresWithoutRepeatingYears = figuresClone.filter(
		(figure) => figure.birthYear !== figure1.birthYear
	);
	const index2 = Math.floor(Math.random() * figuresWithoutRepeatingYears.length);
	const figure2 = figuresWithoutRepeatingYears[index2];

	const [earlierFigure, laterFigure] =
		figure1.birthYear < figure2.birthYear ? [figure1, figure2] : [figure2, figure1];

	return {
		question: 'Which historical figure was born first?',
		options: [figure1.name, figure2.name],
		answer: earlierFigure.name,
		explanation: `${earlierFigure.name} (${yearToString(earlierFigure.birthYear)}) was born before ${laterFigure.name} (${yearToString(laterFigure.birthYear)}).`
	};
}
