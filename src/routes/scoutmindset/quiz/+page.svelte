<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import ConfidenceSelector from '$lib/components/ConfidenceSelector.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { addAnswer, getQuestionSetProgress, popLatestAnswerInQuestionSet } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { ArrowLeftIcon, ArrowRightIcon } from '@sidekickicons/svelte/20/solid';

	const QUESTION_SET = 'Scout Mindset';

	const questionIndexQuery = stateQuery(() => getQuestionSetProgress(QUESTION_SET));
	const questionIndex = $derived(questionIndexQuery.current);
	const currentQuestion = $derived(
		questionIndex !== undefined ? questions[questionIndex] : undefined
	);

	let selectedAnswer = $state<string>();
	let selectedConfidence = $state<number>();

	function nextQuestion() {
		if (!currentQuestion || !selectedAnswer || !selectedConfidence) return;

		addAnswer({
			question: currentQuestion.question,
			correctAnswer: currentQuestion.answer,
			userAnswer: selectedAnswer,
			explanation: currentQuestion.explanation,
			confidence: selectedConfidence,
			questionSet: QUESTION_SET
		});

		selectedAnswer = undefined;
		selectedConfidence = undefined;
	}

	$effect(() => {
		if (questionIndex !== undefined && questionIndex >= questions.length) {
			goto('/scoutmindset/results');
		}
	});

	async function previousQuestion() {
		if (questionIndex === undefined || questionIndex <= 0) {
			goto('/scoutmindset');
			return;
		}

		const latestAnswer = await popLatestAnswerInQuestionSet(QUESTION_SET);

		if (latestAnswer) {
			selectedAnswer = latestAnswer.userAnswer;
			selectedConfidence = latestAnswer.confidence;
		}
	}
</script>

<div class="flex flex-col gap-10">
	<Heading level={1}>Scout Mindset Calibration Quiz</Heading>

	{#if questionIndex !== undefined && currentQuestion}
		<div class="flex items-center gap-2 text-sm whitespace-nowrap text-main-500 dark:text-main-400">
			<span>
				{questionIndex}/{questions.length}
			</span>
			<ProgressBar progress={questionIndex} total={questions.length} size="sm" />
			<span>
				{Math.round((questionIndex / questions.length) * 100)}%
			</span>
		</div>

		<div class="flex flex-col gap-4">
			<Heading level={2}>{currentQuestion.question}</Heading>
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
				{#if questionIndex < questions.length - 1}
					Next question
				{:else}
					Finish
				{/if}
			</Button>
		</div>
	{/if}
</div>
