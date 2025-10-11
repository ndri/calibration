import Dexie, { type EntityTable } from 'dexie';
import {
	generateQuestionString,
	getCategories,
	getExtendedCategories,
	type Category,
	type ExtendedCategory
} from '$lib/questions/questions';

export interface Answer {
	id: number;
	question: string;
	options?: string[]; // optional due to legacy reasons, should always be defined for new answers
	userAnswer: string;
	correctAnswer: string;
	explanation?: string; // legacy
	confidence: number;
	questionSet: ExtendedCategory;
	answeredAt: Date;
}

export interface AppConfig {
	id: number;
	infiniteCalibrationCategories?: Category[];
	resultsCategories?: ExtendedCategory[];
	lastModified?: Date;
}

class CalibrationDB extends Dexie {
	answers!: EntityTable<Answer, 'id'>;
	config!: EntityTable<AppConfig, 'id'>;

	constructor() {
		super('Calibration');

		this.version(1).stores({
			answers:
				'++id, question, answer, correctAnswer, explanation, confidence, answeredAt, questionSet'
		});

		this.version(2).stores({
			answers:
				'++id, question, answer, correctAnswer, explanation, confidence, answeredAt, questionSet',
			config: '++id'
		});
	}
}

export const db = new CalibrationDB();

// Config
const CONFIG_ID = 1;

function getDefaultConfig(): AppConfig {
	return {
		id: CONFIG_ID,
		infiniteCalibrationCategories: getCategories(),
		resultsCategories: getExtendedCategories(),
		lastModified: new Date()
	};
}

export async function getConfig() {
	const config = await db.config.get(CONFIG_ID);

	if (!config) return getDefaultConfig();

	return config;
}

export async function updateConfig(updates: Partial<Omit<AppConfig, 'id' | 'lastModified'>>) {
	const config = await getConfig();
	await db.config.put({ ...config, ...updates, lastModified: new Date() });
}

export async function resetConfig() {
	return db.config.put(getDefaultConfig());
}

// Answers
export async function getAllAnswers() {
	return db.answers.toArray();
}

export async function getAnswersForQuestionSet(questionSet: string) {
	return getAnswersForQuestionSets([questionSet]);
}

export async function getAnswersForQuestionSets(questionSets: string[]) {
	return db.answers.filter((answer) => questionSets.includes(answer.questionSet)).toArray();
}

export async function getRecentQuestions(n: number) {
	return (await db.answers.orderBy('id').reverse().limit(n).toArray()).map((answer) =>
		generateQuestionString(answer.question, answer.options ?? [])
	);
}

export async function addAnswer(
	{
		question,
		options,
		userAnswer,
		correctAnswer,
		confidence,
		questionSet
	}: Omit<Answer, 'id' | 'answeredAt'>,
	index?: number
) {
	if (index === undefined) {
		return db.answers.add({
			question,
			options,
			userAnswer,
			correctAnswer,
			confidence,
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
			options,
			userAnswer,
			correctAnswer,
			confidence,
			answeredAt: new Date()
		});
	}

	return db.answers.add({
		question,
		options,
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
	await db.transaction('rw', db.answers, db.config, async () => {
		await db.answers.clear();
		await db.config.clear();
	});
}

export async function exportDatabase() {
	const answers = await db.answers.toArray();
	const config = (await db.config.get(CONFIG_ID)) ?? getDefaultConfig();

	return { answers, config };
}

export async function importDatabase(data: { answers: Answer[]; config?: AppConfig }) {
	await db.transaction('rw', db.answers, db.config, async () => {
		await db.answers.clear();
		await db.answers.bulkPut(data.answers);

		if (data.config) {
			await db.config.put({
				...data.config,
				id: CONFIG_ID,
				lastModified: new Date()
			});
		}
	});
}
