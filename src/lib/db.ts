import Dexie, { type EntityTable } from 'dexie';

export interface Answer {
	id: number;
	question: string;
	userAnswer: string;
	correctAnswer: string;
	explanation?: string;
	confidence: number;
	questionSet: 'Scout Mindset';
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
	index: number,
	{
		question,
		userAnswer,
		correctAnswer,
		explanation,
		confidence,
		questionSet
	}: Omit<Answer, 'id' | 'answeredAt'>
) {
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
