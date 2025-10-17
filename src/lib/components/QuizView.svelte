<script lang="ts">
	import type { Question, QuestionWithCategory } from '$lib/questions/questions';
	import type { Snippet } from 'svelte';
	import Heading from './Heading.svelte';
	import QuestionView from './QuestionView.svelte';
	import QuizProgress from './QuizProgress.svelte';

	interface Props {
		title: string;
		question: Question | QuestionWithCategory | undefined;
		answerMode?: boolean;
		progressBar?: {
			progress: number;
			total: number;
		};
		selectedAnswer: string | undefined;
		selectedConfidence: number | undefined;
		buttons: Snippet;
	}

	let {
		title,
		question,
		selectedAnswer = $bindable(),
		selectedConfidence = $bindable(),
		answerMode,
		progressBar,
		buttons
	}: Props = $props();
</script>

<div class="flex h-full w-full max-w-lg flex-col gap-10">
	<Heading level={2} class="sr-only!">{title}</Heading>

	{#if question}
		<div class="flex h-full flex-col justify-center gap-10 lg:h-auto">
			{#if progressBar}
				<QuizProgress {...progressBar} />
			{/if}
			<QuestionView {question} bind:selectedAnswer bind:selectedConfidence {answerMode} />
		</div>
		<div class="flex flex-wrap justify-between gap-2">{@render buttons()}</div>
	{/if}
</div>
