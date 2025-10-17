<script lang="ts">
	import QuizView from '$lib/components/QuizView.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MultiSelectDialog from '$lib/components/ui/MultiSelectDialog.svelte';
	import { addAnswer, getConfig, getRecentQuestions, updateConfig } from '$lib/db';
	import {
		getCategories,
		type Category,
		type QuestionWithCategory
	} from '$lib/questions/questions';
	import { generateNewishQuestionFromCategory } from '$lib/questions/generate';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { explicitEffect } from '$lib/utils/svelte.svelte';
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

	const recentAnswersQuery = stateQuery(() => getRecentQuestions(100));
	const recentAnswers = $derived(recentAnswersQuery.current);

	function newQuestion() {
		question = generateNewishQuestionFromCategory(categories, recentAnswers);
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
				options: $state.snapshot(question.options),
				userAnswer: selectedAnswer,
				correctAnswer: question.answer,
				confidence: selectedConfidence,
				questionSet: question.questionSet
			},
			undefined
		);
	}

	explicitEffect(
		() => {
			if (categories) newQuestion();
		},
		() => [categories]
	);
</script>

<svelte:head><title>{createTitle()}</title></svelte:head>

<QuizView
	title="Infinite Calibration"
	{question}
	bind:selectedAnswer
	bind:selectedConfidence
	answerMode={mode === 'answer'}
>
	{#snippet buttons()}
		{#if mode === 'question'}
			<Button
				size="lg"
				variant="secondary"
				onclick={() => {
					if (!categories || !categoriesDialog) return;

					categoriesDialog.setValues(categories);
					categoriesDialog.open();
				}}
				LeftIcon={Cog6ToothIcon}
			>
				{categories?.length ?? 0}/{allCategories.length} categories selected
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
		{:else}
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
		{/if}
	{/snippet}
</QuizView>

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
