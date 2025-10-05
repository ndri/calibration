<script lang="ts">
	import { CONFIDENCES } from '$lib/utils/calibration';
	import ButtonGroup from './ButtonGroup.svelte';

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
