<script lang="ts">
	import type { Question } from '$lib/types';
	import ButtonGroup from './ButtonGroup.svelte';
	import ConfidenceSelector from './ConfidenceSelector.svelte';

	interface Props {
		question: Question;
	}

	const { question }: Props = $props();

	let selectedOption = $state<(typeof question.options)[0]>();
</script>

<div class="flex flex-col gap-4">
	<div>{question.question}</div>
	<div class="flex gap-2">
		<ButtonGroup values={question.options} />
		<ConfidenceSelector />
	</div>
</div>
