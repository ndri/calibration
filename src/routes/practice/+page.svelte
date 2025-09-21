<script lang="ts">
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import ConfidenceSelector from '$lib/components/ConfidenceSelector.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { addAnswer } from '$lib/db';
	import { generateQuestion } from '$lib/questions/generate';
	import type { QuestionWithSet } from '$lib/types';
	import { createTitle } from '$lib/utils/title';
	import { ArrowRightIcon, ChartBarIcon, CheckIcon } from '@sidekickicons/svelte/20/solid';
	import { onMount } from 'svelte';

	let mode = $state<'question' | 'answer'>('question');

	let question = $state<QuestionWithSet>();
	let selectedAnswer = $state<string>();
	let selectedConfidence = $state<number>();

	function newQuestion() {
		question = generateQuestion();
		selectedAnswer = undefined;
		selectedConfidence = undefined;
		mode = 'question';
	}

	function showAnswer() {
		if (!question || !selectedAnswer || !selectedConfidence) return;

		mode = 'answer';

		addAnswer(
			{
				question: question.question,
				userAnswer: selectedAnswer!,
				correctAnswer: question.answer,
				explanation: question.explanation,
				confidence: selectedConfidence!,
				questionSet: question.questionSet
			},
			undefined
		);
	}

	onMount(newQuestion);
</script>

<svelte:head><title>{createTitle('Infinite')}</title></svelte:head>

<div class="flex flex-col gap-10">
	<Heading level={2}>Infinite Calibration</Heading>

	{#if question}
		{#if mode === 'question'}
			<div class="flex flex-col gap-4">
				<Heading level={3}>{question.question}</Heading>
				<ButtonGroup values={question.options} bind:selectedValue={selectedAnswer} />
				<Paragraph>How confident are you in your answer?</Paragraph>
				<ConfidenceSelector bind:selectedConfidence />
			</div>

			<div class="flex justify-end">
				<Button
					size="lg"
					LeftIcon={CheckIcon}
					variant="primary"
					onclick={showAnswer}
					disabled={!selectedAnswer || !selectedConfidence}
				>
					Answer
				</Button>
			</div>
		{:else if mode === 'answer' && selectedAnswer && selectedConfidence}
			<div class="flex flex-col gap-4">
				<Heading level={3}>The correct answer is: {question.answer}</Heading>
				<Paragraph>Your answer: {selectedAnswer}</Paragraph>
				<Paragraph>Your confidence: {Math.round(selectedConfidence * 100)}%</Paragraph>
				{#if question.explanation}
					<Paragraph>{question.explanation}</Paragraph>
				{/if}
			</div>

			<div class="flex justify-between">
				<Button size="lg" LeftIcon={ChartBarIcon} variant="secondary" href="/results">
					See results
				</Button>
				<Button size="lg" RightIcon={ArrowRightIcon} variant="primary" onclick={newQuestion}>
					Next Question
				</Button>
			</div>
		{/if}
	{/if}
</div>
