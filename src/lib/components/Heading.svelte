<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		level: 1 | 2;
		children: Snippet;
	}

	const { level, children }: Props = $props();

	const colourClasses = 'text-accent-800 dark:text-accent-300';
</script>

{#if level === 1}
	<h1 class={['text-2xl font-bold', colourClasses]}>
		{@render children()}
	</h1>
{:else if level === 2}
	<h2 class={['text-lg font-medium', colourClasses]}>
		{@render children()}
	</h2>
{/if}
