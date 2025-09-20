<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import { getAnswersForQuestionSet } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { goto } from '$app/navigation';
	import AccuracyChart from '$lib/components/AccuracyChart.svelte';
	import Disclosure from '$lib/components/Disclosure.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { HomeIcon } from '@sidekickicons/svelte/20/solid';
	import Link from '$lib/components/Link.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import AccuracyTable from '$lib/components/AccuracyTable.svelte';
	import QuizProgress from '$lib/components/QuizProgress.svelte';

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

	$effect(() => {
		if (!answers) return;

		if (answers.length !== questions.length) {
			goto('/scoutmindset/quiz');
		}
	});
</script>

<div class="flex flex-col gap-10">
	<Heading level={1}>Scout Mindset Calibration Quiz</Heading>
	<QuizProgress progress={40} total={40} />

	{#if answers && results}
		<div class="flex flex-col gap-10">
			<div class="flex flex-col gap-4">
				<Heading level={2}>Results</Heading>
				<div class="flex flex-col gap-8">
					<Paragraph>
						Being perfectly calibrated would mean that your “X% sure” claims are in fact correct X
						percent of the time. Perfect calibration is an abstract ideal, not something that's
						possible to achieve in reality. Still, it's a useful benchmark against which to compare
						yourself.
					</Paragraph>
					<AccuracyChart accuracyMap={results} />
					<AccuracyTable accuracyMap={results} />
				</div>
			</div>
			<Disclosure>
				{#snippet question()}
					<Heading level={2}>All answers</Heading>
				{/snippet}
				<div class="flex flex-col divide-y divide-main-200 dark:divide-main-800">
					{#each answers as answer, i}
						<div class="flex flex-col gap-3 py-5 text-sm first:pt-0 last:pb-0">
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
			<div class="flex flex-col gap-4">
				<Heading level={2}>What's next?</Heading>
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
			</div>
		</div>
	{/if}

	<div class="flex justify-end">
		<Button size="lg" onclick={() => goto('/')} LeftIcon={HomeIcon}>Home</Button>
	</div>
</div>
