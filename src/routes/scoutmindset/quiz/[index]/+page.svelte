<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { addAnswer, getAnswerInQuestionSet, getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { ArrowLeftIcon, ArrowRightIcon } from '@sidekickicons/svelte/20/solid';
	import type { PageProps } from './$types';
	import QuizView from '$lib/components/QuizView.svelte';

	const QUESTION_SET = 'Scout Mindset';

	let { data }: PageProps = $props();

	const index = $derived(parseInt(data.index));

	const currentQuestion = $derived(questions[index - 1]);

	const existingAnswerQuery = stateQuery(
		() => getAnswerInQuestionSet(QUESTION_SET, index - 1),
		() => [index]
	);
	const existingAnswer = $derived(existingAnswerQuery.current);

	const progressQuery = stateQuery(() => getQuestionSetProgress(QUESTION_SET));
	const progress = $derived(progressQuery.current);

	let selectedAnswer = $state<string>();
	let selectedConfidence = $state<number>();

	async function nextQuestion() {
		if (!selectedAnswer || !selectedConfidence) return;

		await addAnswer(
			{
				question: currentQuestion.question,
				options: $state.snapshot(currentQuestion.options),
				userAnswer: selectedAnswer,
				correctAnswer: currentQuestion.answer,
				confidence: selectedConfidence,
				questionSet: QUESTION_SET
			},
			index - 1
		);

		if (index < questions.length) {
			goto(`/scoutmindset/quiz/${index + 1}`);
		} else {
			goto('/scoutmindset/results');
		}
	}

	async function previousQuestion() {
		if (index > 1) {
			goto(`/scoutmindset/quiz/${index - 1}`);
		} else {
			goto('/scoutmindset');
		}
	}

	$effect(() => {
		if (existingAnswer === undefined || progress === undefined) return;

		if (index - 1 > progress) {
			goto(`/scoutmindset/quiz`);
		}
	});

	$effect(() => {
		if (index < 1 || index > questions.length) {
			goto('/scoutmindset/quiz');
		}
	});

	$effect(() => {
		if (!progress) return;

		if (progress >= questions.length) {
			goto('/scoutmindset/results');
		}
	});

	$effect(() => {
		if (existingAnswer) {
			selectedAnswer = existingAnswer.userAnswer;
			selectedConfidence = existingAnswer.confidence;
		} else {
			selectedAnswer = undefined;
			selectedConfidence = undefined;
		}
	});
</script>

<QuizView
	title="Scout Mindset Calibration Quiz"
	question={currentQuestion}
	bind:selectedAnswer
	bind:selectedConfidence
	progressBar={progress !== undefined
		? {
				progress,
				total: questions.length
			}
		: undefined}
>
	{#snippet buttons()}
		<Button
			size="lg"
			LeftIcon={ArrowLeftIcon}
			variant="secondary"
			onclick={previousQuestion}
			shortcutKey="backspace"
		>
			Back
		</Button>
		{#if progress !== undefined}
			<Button
				size="lg"
				RightIcon={ArrowRightIcon}
				variant="primary"
				onclick={nextQuestion}
				disabled={!selectedAnswer || !selectedConfidence}
				shortcutKey="enter"
			>
				{#if progress < questions.length - 1}
					Next question
				{:else}
					Finish
				{/if}
			</Button>
		{/if}
	{/snippet}
</QuizView>
