<script lang="ts">
	import GroupButton from './GroupButton.svelte';

	interface Props {
		values: string[];
		selectedValue?: string | undefined;
	}

	let { values, selectedValue = $bindable() }: Props = $props();
</script>

<div class="flex">
	{#each values as value (value)}
		<GroupButton
			selected={selectedValue === value}
			onclick={() => {
				selectedValue = value;
			}}
		>
			{value}
		</GroupButton>
	{/each}
</div>
