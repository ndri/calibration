<script lang="ts" generics="T extends string | number">
	import GroupButton from './GroupButton.svelte';

	interface Props {
		buttons: {
			value: T;
			label?: string;
			shortcutKey?: string;
		}[];
		selectedValue?: T | undefined;
		highlightedValue?: T | undefined;
		disabled?: boolean;
	}

	let { buttons, selectedValue = $bindable(), highlightedValue, disabled }: Props = $props();
</script>

<div class="flex">
	{#each buttons as { value, label, shortcutKey } (value)}
		<GroupButton
			selected={selectedValue === value}
			highlighted={highlightedValue === value}
			{disabled}
			{shortcutKey}
			onclick={() => {
				selectedValue = value;
			}}
		>
			{label ?? value}
		</GroupButton>
	{/each}
</div>
