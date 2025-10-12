import type { Answer } from '$lib/db';
import { sum } from './array';

export const CONFIDENCES = {
	'55%': 0.55,
	'65%': 0.65,
	'75%': 0.75,
	'85%': 0.85,
	'95%': 0.95
} as const;
export const TOTAL_STARS = 5;

export type AccuracyMap = Map<number, { correct: number; total: number }>;

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

	// Square the score to make higher scores more challenging to achieve
	const squaredAverageScore = averageScore ** 2;

	return Math.round(squaredAverageScore * 100);
}

export function getAccuracyColor(confidence: number, accuracy: number) {
	if (isNaN(accuracy)) return 'grey';

	const diff = Math.round(Math.abs(confidence - accuracy) * 1000) / 1000;
	if (diff <= 0.02) return 'cyan';
	if (diff <= 0.1) return 'green';
	if (diff <= 0.2) return 'yellow';
	if (diff <= 0.3) return 'orange';
	return 'red';
}

export function getScoreColor(score: number) {
	if (score >= 90) return 'cyan';
	if (score >= 80) return 'green';
	if (score >= 65) return 'yellow';
	if (score >= 45) return 'orange';
	if (score >= 20) return 'red';
	return 'grey';
}

export function getStarCount(score: number) {
	const color = getScoreColor(score);
	const colorStarCountMap = {
		cyan: 5,
		green: 4,
		yellow: 3,
		orange: 2,
		red: 1,
		grey: 0
	} as const;
	return colorStarCountMap[color];
}

function getAccuarcyEmoji(confidence: number, accuracy: number) {
	const color = getAccuracyColor(confidence, accuracy);
	return {
		cyan: '🔵',
		green: '🟢',
		yellow: '🟡',
		orange: '🟠',
		red: '🔴',
		grey: '❓'
	}[color];
}

function getScoreEmoji(score: number) {
	const color = getScoreColor(score);
	return {
		cyan: '🔥💯🎯',
		green: '😎',
		yellow: '😅',
		orange: '😬',
		red: '💩',
		grey: '⁉️'
	}[color];
}

export function generateShareMessage(
	accuracyMap: AccuracyMap,
	{ quizName }: { quizName?: string } = {}
) {
	const score = getCalibrationScore(accuracyMap);

	let message = '';

	if (quizName === undefined) {
		message += `My calibration score: ${score} ${getScoreEmoji(score)}\n\n`;
	} else {
		message += `I scored ${score}% on the ${quizName}! ${getScoreEmoji(score)}\n\n`;
	}

	for (const [confidenceLabel, confidenceValue] of Object.entries(CONFIDENCES)) {
		const { correct, total } = accuracyMap.get(confidenceValue) ?? { correct: 0, total: 0 };
		const accuracy = Math.round((correct / total) * 100);
		const accuracyLabel = isNaN(accuracy) ? 'never' : `${accuracy}% accurate when I'm`;
		const emoji = getAccuarcyEmoji(confidenceValue, accuracy / 100);
		message += `• I'm ${accuracyLabel} ${confidenceLabel} sure ${emoji} \n`;
	}

	message += '\nHow well are you calibrated? ' + window.location.origin;

	return message;
}
