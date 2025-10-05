<script lang="ts">
	import AccuracyChart from '$lib/components/AccuracyChart.svelte';
	import AccuracyTable from '$lib/components/AccuracyTable.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Menu from '$lib/components/ui/Menu.svelte';
	import MultiSelectDialog from '$lib/components/ui/MultiSelectDialog.svelte';
	import { getAnswersForQuestionSets, getConfig, updateConfig } from '$lib/db';
	import { getExtendedCategories, type ExtendedCategory } from '$lib/questions/generate';
	import { calculateCalibration, getCalibrationScore } from '$lib/utils/calibration';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { createTitle } from '$lib/utils/title';
	import { Cog6ToothIcon, EllipsisVerticalIcon } from '@sidekickicons/svelte/16/solid';

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

	const score = $derived(results ? getCalibrationScore(results) : 0);

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
			<Paragraph>Your calibration score is {score}/100.</Paragraph>
			<AccuracyChart accuracyMap={results} />
			<AccuracyTable accuracyMap={results} />
		</div>
	{/if}
</div>

<div class="absolute">
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
</div>
