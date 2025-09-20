<script lang="ts">
	import { getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { goto } from '$app/navigation';

	const QUESTION_SET = 'Scout Mindset';

	const questionIndexQuery = stateQuery(() => getQuestionSetProgress(QUESTION_SET));
	const questionIndex = $derived(questionIndexQuery.current);

	$effect(() => {
		if (questionIndex === undefined) return;

		if (questionIndex >= questions.length) {
			goto('/scoutmindset/results');
		} else {
			goto(`/scoutmindset/quiz/${questionIndex + 1}`);
		}
	});
</script>
