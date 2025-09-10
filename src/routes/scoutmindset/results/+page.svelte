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
		<table
			class={[
				'[&_*]:border-main-200 [&_*]:dark:border-main-700 [&_th,td]:border',
				'[&_th,td]:first-of-type:border-l-0 [&_th,td]:last-of-type:border-r-0',
				'[&_tr:first-child>th]:border-t-0 [&_tr:last-child>td]:border-b-0',
				'[&_th,td]:w-1/3 [&_th,td]:p-2'
			]}
		>
			<thead class="font-bold">
				<tr class="border-b-3 text-center">
					<th>Confidence</th>
					<th>Correct / Total</th>
					<th>Accuracy</th>
				</tr>
			</thead>
			<tbody>
				{#each confidences as confidence}
					{@const correct = results.get(confidence)?.correct ?? 0}
					{@const total = results.get(confidence)?.total ?? 0}
					{@const accuracy = (correct / total) * 100}
					<tr class="text-center text-sm [&>td]:border">
						<td>{Math.round(confidence * 100)}%</td>
						<td>{correct} / {total}</td>

						<td class="font-bold">
							{#if isNaN(accuracy)}
								N/A
							{:else}
								{Math.round(accuracy)}%
							{/if}
						</td>
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
