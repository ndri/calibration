<script lang="ts">
	import { onMount } from 'svelte';
	import GroupButton from './GroupButton.svelte';
	import { createShortcut } from '$lib/utils/mousetrap';

	interface Props {
		buttons: {
			value: string;
			label?: string;
			shortcutKey?: string;
		}[];
		selectedValue?: string | undefined;
		highlightedValue?: string | undefined;
		disabled?: boolean;
	}

	let { buttons, selectedValue = $bindable(), highlightedValue, disabled }: Props = $props();

	onMount(() => {
		buttons.forEach(({ value, shortcutKey }) => {
			if (!shortcutKey) return;

			createShortcut(shortcutKey, () => {
				if (disabled) return;

				selectedValue = value;
			});
		});
	});
</script>

<div class="flex">
	{#each buttons as { value, label } (value)}
		<GroupButton
			selected={selectedValue === value}
			highlighted={highlightedValue === value}
			{disabled}
			onclick={() => {
				selectedValue = value;
			}}
		>
			{label ?? value}
		</GroupButton>
	{/each}
</div>
