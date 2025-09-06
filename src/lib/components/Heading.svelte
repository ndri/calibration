<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		level: 1 | 2;
		children: Snippet;
	}

	const { level, children }: Props = $props();
</script>

{#if level === 1}
	<h1 class="text-2xl font-bold text-accent-800">
		{@render children()}
	</h1>
{:else if level === 2}
	<h2 class="text-lg font-medium text-accent-800">
		{@render children()}
	</h2>
{/if}
