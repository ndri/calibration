import { redirect } from '@sveltejs/kit';
import questions from '$lib/data/scout_mindset_questions.json';

export async function load({ params }) {
	const index = parseInt(params.index);
	if (isNaN(index) || index <= 0 || index > questions.length) {
		redirect(303, '/scoutmindset/quiz');
	}
}
