<script lang="ts">
	import { onMount } from 'svelte';
	import GroupButton from './GroupButton.svelte';
	import { createShortcut } from '$lib/utils/mousetrap';

	interface Props {
		values: string[];
		selectedValue?: string | undefined;
		highlightedValue?: string | undefined;
		disabled?: boolean;
		shortcuts?: string[];
	}

	let {
		values,
		selectedValue = $bindable(),
		highlightedValue,
		disabled,
		shortcuts
	}: Props = $props();

	onMount(() => {
		if (shortcuts) {
			shortcuts.forEach((shortcut, i) => {
				createShortcut(shortcut, () => {
					if (disabled) return;
					selectedValue = values[i];
				});
			});
		}
	});
</script>

<div class="flex">
	{#each values as value (value)}
		<GroupButton
			selected={selectedValue === value}
			highlighted={highlightedValue === value}
			{disabled}
			onclick={() => {
				selectedValue = value;
			}}
		>
			{value}
		</GroupButton>
	{/each}
</div>
