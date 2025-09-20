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

<div class="flex flex-col rounded-lg bg-main-50 dark:bg-main-900">
	<button
		class={[
			'flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-left',
			'hover:bg-main-100 dark:hover:bg-main-800',
			'active:bg-main-200 dark:active:bg-main-700'
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
		<div class="flex flex-col gap-3 p-6" transition:slide={{ duration: 500 }}>
			{@render children()}
		</div>
	{/if}
</div>
