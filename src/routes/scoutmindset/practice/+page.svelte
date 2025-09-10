<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import ConfidenceSelector from '$lib/components/ConfidenceSelector.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { addAnswer, getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { ArrowRightIcon } from '@sidekickicons/svelte/20/solid';

	const QUESTION_SET = 'Scout Mindset Calibration Practice';

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
</script>

<div class="flex flex-col gap-10">
	<Heading level={1}>Scout Mindset Calibration Practice</Heading>

	{#if questionIndex !== undefined && currentQuestion}
		<ProgressBar progress={questionIndex} total={questions.length} size="sm" />

		<div class="flex flex-col gap-4">
			<Heading level={2}>{questionIndex + 1}. {currentQuestion.question}</Heading>
			<ButtonGroup values={currentQuestion.options} bind:selectedValue={selectedAnswer} />
			<Paragraph>How confident are you in your answer?</Paragraph>
			<ConfidenceSelector bind:selectedConfidence />
		</div>

		<div class="flex justify-start">
			<Button
				size="lg"
				RightIcon={ArrowRightIcon}
				variant="secondary"
				onclick={nextQuestion}
				disabled={!selectedAnswer || !selectedConfidence}
			>
				Next question
			</Button>
		</div>
	{/if}
</div>
