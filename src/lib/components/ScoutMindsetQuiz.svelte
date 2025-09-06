<script lang="ts">
	import categories from '$lib/data/scout_mindset_questions.json';
	import Heading from './Heading.svelte';
	import Question from './Question.svelte';
	interface Props {}

	const {}: Props = $props();
</script>

{#each categories as category (category.title)}
	<Heading level={2}>{category.title}</Heading>
	{#each category.questions as question (question)}
		<Question {question} />
	{/each}
{/each}
