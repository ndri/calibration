<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		level?: 1 | 2 | 3;
		class?: ClassValue;
		children: Snippet;
	}

	const { level = 1, class: className, children }: Props = $props();

	const colourClasses = 'text-accent-800 dark:text-accent-300';
</script>

{#if level === 1}
	<h1 class={['text-2xl font-medium', colourClasses, className]}>
		{@render children()}
	</h1>
{:else if level === 2}
	<h2 class={['text-lg font-normal', colourClasses, className]}>
		{@render children()}
	</h2>
{:else if level === 3}
	<h3 class={['text-md font-normal', colourClasses, className]}>
		{@render children()}
	</h3>
{/if}
