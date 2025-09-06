<script lang="ts">
	import GroupButton from './GroupButton.svelte';

	interface Props {
		values: string[];
	}

	const { values }: Props = $props();

	let selectedValue = $state<string | undefined>();
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
