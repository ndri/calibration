import Dexie, { type EntityTable } from 'dexie';
import type { Category } from './questions/generate';

export interface Answer {
	id: number;
	question: string;
	userAnswer: string;
	correctAnswer: string;
	explanation?: string;
	confidence: number;
	questionSet: Category | 'Scout Mindset';
	answeredAt: Date;
}

class CalibrationDB extends Dexie {
	answers!: EntityTable<Answer, 'id'>;

	constructor() {
		super('Calibration');

		this.version(1).stores({
			answers:
				'++id, question, answer, correctAnswer, explanation, confidence, answeredAt, questionSet'
		});
	}
}

export const db = new CalibrationDB();

export async function getAllAnswers() {
	return db.answers.orderBy('answeredAt').toArray();
}

export async function getAnswersForQuestionSet(questionSet: string) {
	return db.answers
		.orderBy('answeredAt')
		.filter((answer) => answer.questionSet === questionSet)
		.toArray();
}

export async function addAnswer(
	{
		question,
		userAnswer,
		correctAnswer,
		explanation,
		confidence,
		questionSet
	}: Omit<Answer, 'id' | 'answeredAt'>,
	index?: number
) {
	if (index === undefined) {
		return db.answers.add({
			question,
			userAnswer,
			correctAnswer,
			confidence,
			explanation,
			questionSet,
			answeredAt: new Date()
		});
	}

	const progress = await getQuestionSetProgress(questionSet);

	// Update existing answer if it is already answered
	if (index < progress) {
		const answer = await getAnswerInQuestionSet(questionSet, index);

		if (!answer) return;

		return db.answers.update(answer.id, {
			question,
			userAnswer,
			correctAnswer,
			confidence,
			explanation,
			answeredAt: new Date()
		});
	}

	return db.answers.add({
		question,
		userAnswer,
		correctAnswer,
		confidence,
		explanation,
		questionSet,
		answeredAt: new Date()
	});
}

export async function clearAnswers() {
	return db.answers.clear();
}

export async function getQuestionSetProgress(questionSet: string) {
	return db.answers.filter((answer) => answer.questionSet === questionSet).count();
}

export async function getAnswerInQuestionSet(questionSet: string, index: number) {
	const answers = await db.answers.where('questionSet').equals(questionSet).sortBy('id');

	if (index < 0 || index >= answers.length) return null;

	return answers[index];
}

export async function countAllData() {
	const answers = await db.answers.count();

	return { answers };
}

export async function deleteAllData() {
	await db.answers.clear();
}

export async function exportDatabase() {
	const answers = await db.answers.toArray();

	return { answers };
}

export async function importDatabase(data: { answers: Answer[] }) {
	await db.transaction('rw', db.answers, async () => {
		await db.answers.clear();

		await db.answers.bulkPut(data.answers);
	});
}
