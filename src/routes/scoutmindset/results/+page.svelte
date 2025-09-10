<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import { getAnswersForQuestionSet } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { goto } from '$app/navigation';

	const QUESTION_SET = 'Scout Mindset Calibration Practice';

	const answersQuery = stateQuery(() => getAnswersForQuestionSet(QUESTION_SET));
	const answers = $derived(answersQuery.current);

	const results = $derived.by(() => {
		if (!answers) return;

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
	});

	const confidences = [0.55, 0.65, 0.75, 0.85, 0.95];

	$effect(() => {
		if (!answers) return;

		if (answers.length !== questions.length) {
			goto('/scoutmindset/practice');
		}
	});
</script>

<div class="flex flex-col gap-10">
	<Heading level={1}>Scout Mindset Calibration Practice</Heading>
	<Heading level={2}>Results</Heading>
	{#if answers && results}
		<table>
			<thead>
				<tr>
					<th>Confidence</th>
					<th>Correct</th>
					<th>Total</th>
					<th>Accuracy</th>
				</tr>
			</thead>
			<tbody>
				{#each confidences as confidence}
					{@const correct = results.get(confidence)?.correct ?? 0}
					{@const total = results.get(confidence)?.total ?? 0}
					{@const accuracy = total > 0 ? (correct / total) * 100 : Infinity}
					<tr>
						<td>{Math.round(confidence * 100)}%</td>
						<td>{correct}</td>
						<td>{total}</td>
						<td>{Math.round(accuracy)}%</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<Heading level={3}>All answers</Heading>
		<table>
			<thead>
				<tr>
					<th>Question</th>
					<th>Your Answer</th>
					<th>Correct Answer</th>
					<th>Your Confidence</th>
				</tr>
			</thead>
			<tbody>
				{#each answers as answer}
					<tr>
						<td>{answer.question}</td>
						<td>{answer.userAnswer}</td>
						<td>{answer.correctAnswer}</td>
						<td>{Math.round(answer.confidence * 100)}%</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
