<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		selected?: boolean;
		onclick?: () => void;
	}

	const { children, selected, onclick }: Props = $props();
</script>

<button
	type="button"
	class={[
		'cursor-pointer border-r-0 px-3.5 py-2.5 text-sm font-semibold',
		'border border-main-300 dark:border-none',
		'first-of-type:rounded-l-lg last-of-type:rounded-r-lg last-of-type:border-r',
		selected
			? 'bg-accent-200 dark:bg-accent-900'
			: 'bg-white hover:bg-main-100 dark:bg-main-700 dark:hover:bg-main-600'
	]}
	{onclick}
>
	{@render children()}
</button>
