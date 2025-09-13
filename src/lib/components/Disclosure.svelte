<script lang="ts">
	import { ChevronDownIcon, ChevronUpIcon } from '@sidekickicons/svelte/24/outline';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		question: string | Snippet;
		children: Snippet;
		expandedByDefault?: boolean;
	}

	const { question, children, expandedByDefault }: Props = $props();

	let show = $state(expandedByDefault ?? false);
</script>

<div class="flex flex-col py-2">
	<button
		class={[
			'-mx-3 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left',
			'hover:bg-main-200 dark:hover:bg-main-800'
		]}
		onclick={() => (show = !show)}
	>
		{#if show}
			<ChevronUpIcon class="h-5 w-5 text-main-500" />
		{:else}
			<ChevronDownIcon class="h-5 w-5 text-main-500" />
		{/if}
		{#if typeof question === 'string'}
			<span class="text-lg">{question}</span>
		{:else}
			{@render question()}
		{/if}
	</button>
	{#if show}
		<div class="-mx-3 flex flex-col gap-3 p-3" transition:slide={{ duration: 500 }}>
			{@render children()}
		</div>
	{/if}
</div>
