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

	let selectedValue = $state<keyof typeof CONFIDENCES | undefined>(
		getKeyByValue(selectedConfidence) as keyof typeof CONFIDENCES
	);

	function getKeyByValue(value: number | undefined) {
		if (value === undefined) return undefined;

		const entry = Object.entries(CONFIDENCES).find(([, value]) => value === selectedConfidence);
		if (entry) {
			return entry[0];
		} else {
			return undefined;
		}
	}

	$effect(() => {
		if (selectedValue) {
			selectedConfidence = CONFIDENCES[selectedValue];
		} else {
			selectedConfidence = undefined;
		}
	});

	explicitEffect(
		() => {
			if (selectedValue) {
				selectedConfidence = CONFIDENCES[selectedValue];
			} else {
				selectedConfidence = undefined;
			}
		},
		() => [selectedValue]
	);

	explicitEffect(
		() => {
			if (selectedConfidence) {
				selectedValue = getKeyByValue(selectedConfidence) as keyof typeof CONFIDENCES;
			} else {
				selectedValue = undefined;
			}
		},
		() => [selectedConfidence]
	);
</script>

<ButtonGroup
	buttons={Object.keys(CONFIDENCES).map((value) => ({ value, shortcutKey: String(value)[0] }))}
	bind:selectedValue
	{disabled}
	highlightedValue={highlightSelected ? getKeyByValue(selectedConfidence) : undefined}
/>
