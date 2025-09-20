<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import ConfidenceSelector from '$lib/components/ConfidenceSelector.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import QuizProgress from '$lib/components/QuizProgress.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { addAnswer, getAnswerInQuestionSet, getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { ArrowLeftIcon, ArrowRightIcon } from '@sidekickicons/svelte/20/solid';
	import type { PageProps } from './$types';

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

		await addAnswer(index - 1, {
			question: currentQuestion.question,
			userAnswer: selectedAnswer,
			correctAnswer: currentQuestion.answer,
			explanation: currentQuestion.explanation,
			confidence: selectedConfidence,
			questionSet: QUESTION_SET
		});

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

<div class="flex flex-col gap-10">
	<Heading level={1}>Scout Mindset Calibration Quiz</Heading>

	{#if progress !== undefined && currentQuestion}
		<QuizProgress {progress} total={questions.length} />

		<div class="flex flex-col gap-4">
			<Heading level={2}>{index}. {currentQuestion.question}</Heading>
			<ButtonGroup values={currentQuestion.options} bind:selectedValue={selectedAnswer} />
			<Paragraph>How confident are you in your answer?</Paragraph>
			<ConfidenceSelector bind:selectedConfidence />
		</div>

		<div class="flex justify-between">
			<Button size="lg" LeftIcon={ArrowLeftIcon} variant="secondary" onclick={previousQuestion}>
				Back
			</Button>
			<Button
				size="lg"
				RightIcon={ArrowRightIcon}
				variant="primary"
				onclick={nextQuestion}
				disabled={!selectedAnswer || !selectedConfidence}
			>
				{#if progress < questions.length - 1}
					Next question
				{:else}
					Finish
				{/if}
			</Button>
		</div>
	{/if}
</div>
