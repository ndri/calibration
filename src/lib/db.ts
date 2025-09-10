import Dexie, { type EntityTable } from 'dexie';

export interface Answer {
	id: number;
	question: string;
	userAnswer: string;
	correctAnswer: string;
	confidence: number;
	questionSet: 'Scout Mindset Calibration Practice';
	answeredAt: Date;
}

class CalibrationDB extends Dexie {
	answers!: EntityTable<Answer, 'id'>;

	constructor() {
		super('Calibration');

		this.version(1).stores({
			answers: '++id, question, answer, correctAnswer, confidence, answeredAt, questionSet'
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

export async function addAnswer({
	question,
	userAnswer,
	correctAnswer,
	confidence,
	questionSet
}: Omit<Answer, 'id' | 'answeredAt'>) {
	return db.answers.add({
		question,
		userAnswer,
		correctAnswer,
		confidence,
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
