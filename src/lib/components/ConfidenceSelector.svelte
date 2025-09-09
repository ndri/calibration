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
	}

	let { selectedConfidence = $bindable() }: Props = $props();

	let selectedValue = $state<keyof typeof CONFIDENCES>();

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
				const entry = Object.entries(CONFIDENCES).find(([, value]) => value === selectedConfidence);
				if (entry) {
					selectedValue = entry[0] as keyof typeof CONFIDENCES;
				} else {
					selectedValue = undefined;
				}
			} else {
				selectedValue = undefined;
			}
		},
		() => [selectedConfidence]
	);
</script>

<ButtonGroup values={Object.keys(CONFIDENCES)} bind:selectedValue />
