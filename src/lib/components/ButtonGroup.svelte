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
		buttonSize?: 'sm' | 'lg';
	}

	let {
		buttons,
		selectedValue = $bindable(),
		highlightedValue,
		disabled,
		buttonSize = 'sm'
	}: Props = $props();
</script>

<div class="grid grid-cols-repeat-(--cols)" style="--cols: {buttons.length}">
	{#each buttons as { value, label, shortcutKey } (value)}
		<GroupButton
			selected={selectedValue === value}
			highlighted={highlightedValue === value}
			{disabled}
			{shortcutKey}
			size={buttonSize}
			onclick={() => {
				selectedValue = value;
			}}
		>
			{label ?? value}
		</GroupButton>
	{/each}
</div>
