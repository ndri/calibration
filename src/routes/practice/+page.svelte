<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import QuestionView from '$lib/components/QuestionView.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MultiSelectDialog from '$lib/components/ui/MultiSelectDialog.svelte';
	import { addAnswer, getConfig, updateConfig } from '$lib/db';
	import { generateQuestion, getCategories, type Category } from '$lib/questions/generate';
	import type { QuestionWithCategory } from '$lib/types';
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
	const allCategories = $derived(getCategories());

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
</script>

<svelte:head><title>{createTitle()}</title></svelte:head>

<div class="flex flex-col gap-10">
	<Heading level={2} class="sr-only">Infinite Calibration</Heading>

	{#if question && categories}
		<QuestionView
			{question}
			bind:selectedAnswer
			bind:selectedConfidence
			answerMode={mode === 'answer'}
		/>
		{#if mode === 'question'}
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
					shortcutKey="enter"
				>
					Answer
				</Button>
			</div>
		{:else}
			<div class="flex justify-between">
				<Button size="lg" LeftIcon={ChartBarIcon} variant="secondary" href="/results">
					See results
				</Button>
				<Button
					size="lg"
					RightIcon={ArrowRightIcon}
					variant="primary"
					onclick={newQuestion}
					shortcutKey="enter"
				>
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
