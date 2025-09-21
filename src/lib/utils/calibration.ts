import type { Answer } from '$lib/db';

export function calculateCalibration(answers: Answer[]) {
	const resultsMap = new Map<number, { correct: number; total: number }>();

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
