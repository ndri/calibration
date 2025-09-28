<script lang="ts">
	import GroupButton from './GroupButton.svelte';

	interface Props {
		values: string[];
		selectedValue?: string | undefined;
		highlightedValue?: string | undefined;
		disabled?: boolean;
	}

	let { values, selectedValue = $bindable(), highlightedValue, disabled }: Props = $props();
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
