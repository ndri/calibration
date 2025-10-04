<script lang="ts">
	import ButtonGroup from './ButtonGroup.svelte';
	import { explicitEffect } from '$lib/utils/svelte.svelte';

	const CONFIDENCES = {
		'55%': 0.55,
		'65%': 0.65,
		'75%': 0.75,
		'85%': 0.85,
		'95%': 0.95
	} as const;

	interface Props {
		selectedConfidence?: number;
		disabled?: boolean;
		highlightSelected?: boolean;
	}

	let { selectedConfidence = $bindable(), disabled, highlightSelected }: Props = $props();
</script>

<ButtonGroup
	buttons={Object.entries(CONFIDENCES).map(([label, value]) => ({
		value,
		label,
		shortcutKey: label[0]
	}))}
	bind:selectedValue={selectedConfidence}
	{disabled}
	highlightedValue={highlightSelected ? selectedConfidence : undefined}
/>
