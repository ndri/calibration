<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import { getAnswersForQuestionSet } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { goto } from '$app/navigation';
	import AccuracyChart from '$lib/components/AccuracyChart.svelte';
	import Disclosure from '$lib/components/Disclosure.svelte';
	import Button from '$lib/components/Button.svelte';
	import { HomeIcon, HomeModernIcon } from '@sidekickicons/svelte/20/solid';
	import Link from '$lib/components/Link.svelte';

	const QUESTION_SET = 'Scout Mindset';

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
			goto('/scoutmindset/quiz');
		}
	});
</script>

<div class="flex flex-col gap-10">
	<Heading level={1}>Scout Mindset Calibration Quiz</Heading>

	{#if answers && results}
		<div class="flex flex-col">
			<Disclosure expandedByDefault>
				{#snippet question()}
					<Heading level={2}>Results</Heading>
				{/snippet}
				<div class="flex flex-col gap-5">
					<AccuracyChart accuracyMap={results} />
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
				</div>
			</Disclosure>
			<Disclosure>
				{#snippet question()}
					<Heading level={2}>All answers</Heading>
				{/snippet}
				<div class="flex flex-col gap-3">
					{#each answers as answer, i}
						<div class="flex flex-col gap-3 rounded-xl bg-white p-4 text-sm dark:bg-main-800">
							<div>
								<span class="text-main-600 dark:text-main-300">Question {i + 1}:</span>
								<span class="font-medium">{answer.question}</span>
							</div>
							<div>
								<span class="text-main-600 dark:text-main-300">Your answer:</span>
								<span
									class={[
										'font-medium',
										answer.userAnswer === answer.correctAnswer
											? 'text-green-600 dark:text-green-400'
											: 'text-red-600 dark:text-red-400'
									]}>{answer.userAnswer}</span
								>
								<span>({Math.round(answer.confidence * 100)}% confidence)</span>
							</div>
							{#if answer.userAnswer !== answer.correctAnswer}
								<div>
									<span class="text-main-600 dark:text-main-300">Correct answer:</span>
									<span class={['font-semibold']}>{answer.correctAnswer}</span>
								</div>
							{/if}
							{#if answer.explanation}
								<div>
									<span class="text-main-600 dark:text-main-300">Explanation:</span>
									<span>{answer.explanation}</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</Disclosure>
			<Disclosure expandedByDefault>
				{#snippet question()}
					<Heading level={2}>What's next?</Heading>
				{/snippet}
				<ul class="ml-4 list-disc leading-8 marker:text-main-600">
					<li>
						Read <Link href="https://search.worldcat.org/title/1164823768" newTab
							><em>The Scout Mindset</em></Link
						> by Julia Galef.
					</li>
					<li>
						Read <Link href="https://search.worldcat.org/title/1401648718" newTab
							><em>Superforecasting</em></Link
						>
						by Philip E. Tetlock and Dan M. Gardner.
					</li>
					<li>
						Try other calibration tools:
						<ul class="ml-4 list-disc">
							<li>
								<Link href="https://www.quantifiedintuitions.org/calibration" newTab
									>Quantified Intuitions' calibration tool</Link
								>
							</li>
							<li>
								<Link href="https://www.clearerthinking.org/tools/calibrate-your-judgment" newTab
									>Clearer Thinking's <em>Calibrate Your Judgement</em> tool</Link
								>
							</li>
						</ul>
					</li>
					<li>
						Make predictions about your own life with <Link href="https://fatebook.io/" newTab
							>Fatebook</Link
						>
					</li>
					<li>
						Forecast future events with others at <Link href="https://www.metaculus.com/" newTab
							>Metaculus</Link
						>.
					</li>
					<li>
						Use a prediction market like <Link href="https://manifold.markets?r=YW5kcmk" newTab
							>Manifold Markets</Link
						> and bet on future events.
					</li>
				</ul>
			</Disclosure>
		</div>
	{/if}

	<div class="flex justify-end">
		<Button size="lg" onclick={() => goto('/')} LeftIcon={HomeIcon}>Home</Button>
	</div>
</div>
