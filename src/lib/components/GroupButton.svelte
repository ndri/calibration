<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		selected?: boolean;
		highlighted?: boolean;
		disabled?: boolean;
		onclick?: () => void;
	}

	const { children, selected, highlighted, disabled, onclick }: Props = $props();
</script>

<button
	type="button"
	class={[
		'border-r-0 px-3.5 py-2.5 text-sm font-semibold',
		'border border-main-300 dark:border-none',
		'first-of-type:rounded-l-lg last-of-type:rounded-r-lg last-of-type:border-r',
		highlighted
			? 'bg-green-100 not-dark:text-green-800 dark:bg-green-700'
			: selected
				? 'bg-accent-200 not-dark:text-accent-900 dark:bg-accent-900'
				: ['bg-white dark:bg-main-800', !disabled && 'hover:bg-main-100 dark:hover:bg-main-700'],
		disabled ? 'cursor-default' : 'cursor-pointer'
	]}
	{disabled}
	{onclick}
>
	{@render children()}
</button>
