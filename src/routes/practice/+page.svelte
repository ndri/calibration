<script lang="ts">
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import ConfidenceSelector from '$lib/components/ConfidenceSelector.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MultiSelectDialog from '$lib/components/ui/MultiSelectDialog.svelte';
	import { addAnswer, getConfig, updateConfig } from '$lib/db';
	import { generateQuestion, getAllCategories, type Category } from '$lib/questions/generate';
	import type { QuestionWithCategory } from '$lib/types';
	import { createShortcut } from '$lib/utils/mousetrap';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { createTitle } from '$lib/utils/title';
	import {
		ArrowRightIcon,
		ChartBarIcon,
		CheckIcon,
		Cog6ToothIcon
	} from '@sidekickicons/svelte/20/solid';

	let mode = $state<'question' | 'answer'>('question');

	let question = $state<QuestionWithCategory>();
	let selectedAnswer = $state<string>();
	let selectedConfidence = $state<number>();

	let categoriesDialog = $state<MultiSelectDialog<Category>>();

	const configQuery = stateQuery(getConfig);
	const config = $derived(configQuery.current);
	const categories = $derived(config?.infiniteCalibrationCategories);
	const allCategories = $derived(getAllCategories());

	function newQuestion() {
		question = generateQuestion(categories);
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

	$effect(() => {
		if (categories) newQuestion();
	});

	createShortcut('enter', () => {
		if (mode === 'question') showAnswer();
		else newQuestion();
	});
</script>

<svelte:head><title>{createTitle()}</title></svelte:head>

<div class="flex flex-col gap-10">
	<Heading level={2} class="sr-only">Infinite Calibration</Heading>

	{#if question && categories}
		{#if mode === 'question'}
			<div class="flex flex-col gap-4">
				<Heading level={3}>{question.question}</Heading>
				<ButtonGroup
					values={question.options}
					bind:selectedValue={selectedAnswer}
					shortcuts={['1', '2']}
				/>
				<Paragraph>How confident are you in your answer?</Paragraph>
				<ConfidenceSelector bind:selectedConfidence />
			</div>

			<div class="flex justify-between">
				<Button
					size="lg"
					variant="secondary"
					onclick={() => {
						if (!categoriesDialog) return;

						categoriesDialog.setValues(categories);
						categoriesDialog.open();
					}}
					LeftIcon={Cog6ToothIcon}
				>
					{categories.length}/{allCategories.length} categories selected
				</Button>
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
				<Heading level={3}>{question.question}</Heading>
				<ButtonGroup
					values={question.options}
					selectedValue={selectedAnswer}
					highlightedValue={question.answer}
					disabled
				/>

				<Paragraph>
					{#if selectedAnswer === question.answer}
						Correct!
					{:else}
						Incorrect.
					{/if}
					{#if question.explanation}
						{question.explanation}
					{/if}
				</Paragraph>
				<ConfidenceSelector
					{selectedConfidence}
					disabled
					highlightSelected={selectedAnswer === question.answer}
				/>
				{#if selectedAnswer !== question.answer}
					<Paragraph>
						{#if selectedConfidence === 0.95}
							It's okay: when you are 95% confident, 1 in every 20 answers can be wrong.
						{:else if selectedConfidence === 0.85}
							Don't worry: when you are 85% confident, about 1 in every 7 answers can be wrong.
						{:else if selectedConfidence === 0.75}
							It's normal: when you are 75% confident, 1 in every 4 answers can be wrong.
						{:else if selectedConfidence === 0.65}
							That's expected: when you are 65% confident, 1 in every ~3 answers can be wrong.
						{:else if selectedConfidence === 0.55}
							No problem: when you are 55% confident, almost half of your answers can be wrong.
						{/if}
					</Paragraph>
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

<div class="absolute">
	<MultiSelectDialog
		bind:this={categoriesDialog}
		options={allCategories.map((category) => ({ value: category, label: category }))}
		submit={(value) => {
			const valueClone = [...value];
			if (valueClone.length === 0) valueClone.push(...allCategories);

			updateConfig({ infiniteCalibrationCategories: valueClone });
		}}
		label="Select which categories to get questions for"
	/>
</div>
