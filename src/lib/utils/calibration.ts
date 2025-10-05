import type { Answer } from '$lib/db';
import { sum } from './array';

type AccuracyMap = Map<number, { correct: number; total: number }>;

export function calculateCalibration(answers: Answer[]) {
	const resultsMap: AccuracyMap = new Map();

	for (const answer of answers) {
		const { confidence, userAnswer: userAnswer, correctAnswer } = answer;
		if (!resultsMap.has(confidence)) {
			resultsMap.set(confidence, { correct: 0, total: 0 });
		}
		const entry = resultsMap.get(confidence);
		if (entry) {
			resultsMap.set(confidence, {
				correct: userAnswer === correctAnswer ? entry.correct + 1 : entry.correct,
				total: entry.total + 1
			});
		}
	}

	return resultsMap;
}

export function getCalibrationScore(accuracyMap: AccuracyMap) {
	const scoreMap = new Map<number, number>();

	for (const [confidence, entry] of accuracyMap.entries()) {
		const result = entry.correct / entry.total;
		const score = 1 - Math.abs(result - confidence) / confidence;
		scoreMap.set(confidence, score);
	}

	const averageScore = sum(Array.from(scoreMap.values())) / scoreMap.size;
	if (isNaN(averageScore)) return 0;

	// Square the score to make higher scores harder to achieve
	const squaredAverageScore = averageScore ** 2;

	return Math.round(squaredAverageScore * 100);
}
