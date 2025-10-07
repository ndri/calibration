<script lang="ts">
	import AccuracyChart from '$lib/components/AccuracyChart.svelte';
	import AccuracyTable from '$lib/components/AccuracyTable.svelte';
	import CalibrationScore from '$lib/components/CalibrationScore.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MultiSelectDialog from '$lib/components/ui/MultiSelectDialog.svelte';
	import { getAnswersForQuestionSets, getConfig, updateConfig } from '$lib/db';
	import { getExtendedCategories, type ExtendedCategory } from '$lib/questions/questions';
	import { calculateCalibration } from '$lib/utils/calibration';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { createTitle } from '$lib/utils/title';
	import { Cog6ToothIcon } from '@sidekickicons/svelte/16/solid';

	const allCategories = $derived(getExtendedCategories());

	const configQuery = stateQuery(getConfig);
	const config = $derived(configQuery.current);
	const categories = $derived(config?.resultsCategories ?? allCategories);

	const answersQuery = stateQuery(
		() => getAnswersForQuestionSets(categories),
		() => [categories]
	);
	const answers = $derived(answersQuery.current);

	const results = $derived.by(() => {
		if (!answers) return;

		return calculateCalibration(answers);
	});

	let categoriesDialog = $state<MultiSelectDialog<ExtendedCategory>>();
</script>

<svelte:head><title>{createTitle('Results')}</title></svelte:head>

<div class="flex flex-col gap-8">
	<div class="flex items-center justify-between">
		<Heading level={2}>Results</Heading>
		<Button
			size="xs"
			variant="secondary"
			onclick={() => {
				if (!categoriesDialog) return;

				categoriesDialog.setValues(categories);
				categoriesDialog.open();
			}}
			LeftIcon={Cog6ToothIcon}
		>
			{categories.length}/{allCategories.length} categories
		</Button>
	</div>
	{#if results}
		<div class="flex flex-col gap-8">
			<CalibrationScore accuracyMap={results} />
			<AccuracyChart accuracyMap={results} />
			<AccuracyTable accuracyMap={results} />
		</div>
	{/if}
</div>

<MultiSelectDialog
	bind:this={categoriesDialog}
	options={allCategories.map((category) => ({ value: category, label: category }))}
	submit={(value) => {
		const valueClone = [...value];
		if (valueClone.length === 0) valueClone.push(...allCategories);

		updateConfig({ resultsCategories: valueClone });
	}}
	label="Select which categories to show results for"
/>
