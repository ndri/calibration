<script lang="ts">
	import { getExplanation, type Question } from '$lib/questions/questions';
	import ButtonGroup from './ButtonGroup.svelte';
	import ConfidenceSelector from './ConfidenceSelector.svelte';
	import Heading from './Heading.svelte';
	import Paragraph from './Paragraph.svelte';

	interface Props {
		question: Question;
		selectedAnswer: string | undefined;
		selectedConfidence: number | undefined;
		answerMode?: boolean;
	}

	let {
		question,
		selectedAnswer = $bindable(),
		selectedConfidence = $bindable(),
		answerMode
	}: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<Heading level={3}>{question.question}</Heading>
	<ButtonGroup
		buttons={question.options.map((value, i) => ({ value, shortcutKey: String(i + 1) }))}
		bind:selectedValue={selectedAnswer}
		disabled={answerMode}
		highlightedValue={answerMode ? question.answer : undefined}
	/>
	<Paragraph>
		{#if answerMode}
			{@const explanation = getExplanation(question.question, question.options)}
			{#if selectedAnswer === question.answer}
				Correct!
			{:else}
				Incorrect.
			{/if}
			{#if explanation}
				{explanation}
			{/if}
		{:else}
			How confident are you in your answer?
		{/if}
	</Paragraph>
	<ConfidenceSelector
		bind:selectedConfidence
		disabled={answerMode}
		highlightSelected={answerMode}
	/>
	{#if answerMode && selectedAnswer !== question.answer}
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
