<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import ConfidenceSelector from '$lib/components/ConfidenceSelector.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import questions from '$lib/data/scout_mindset_questions.json';
	import { addAnswer, getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { ArrowRightIcon } from '@sidekickicons/svelte/20/solid';

	const questionIndexQuery = stateQuery(() =>
		getQuestionSetProgress('Scout Mindset Calibration Practice')
	);
	const questionIndex = $derived(questionIndexQuery.current);
	const currentQuestion = $derived(
		questionIndex !== undefined ? questions[questionIndex] : undefined
	);

	let selectedAnswer = $state<string>();
	let selectedConfidence = $state<number>();

	function nextQuestion() {
		if (!currentQuestion || !selectedAnswer || !selectedConfidence) return;
		if (questionIndex === questions.length - 1) return;

		addAnswer({
			question: currentQuestion.question,
			correctAnswer: currentQuestion.answer,
			answer: selectedAnswer,
			confidence: selectedConfidence,
			questionSet: 'Scout Mindset Calibration Practice'
		});

		selectedAnswer = undefined;
		selectedConfidence = undefined;
	}
</script>

{#if questionIndex !== undefined && currentQuestion}
	<div class="flex flex-col gap-10">
		<Heading level={1}>Scout Mindset Calibration Practice</Heading>

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
	</div>
{/if}
