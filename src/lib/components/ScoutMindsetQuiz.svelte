<script lang="ts">
	import categories from '$lib/data/scout_mindset_questions.json';
	import Heading from './Heading.svelte';
	import Question from './Question.svelte';
	interface Props {}

	const {}: Props = $props();
</script>

<div class="flex flex-col gap-8">
	{#each categories as category (category.title)}
		<div class="flex flex-col gap-6">
			<Heading level={2}>{category.title}</Heading>
			{#each category.questions as question (question)}
				<Question {question} />
			{/each}
		</div>
	{/each}
</div>
