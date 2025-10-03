<script lang="ts">
	import AccuracyChart from '$lib/components/AccuracyChart.svelte';
	import AccuracyTable from '$lib/components/AccuracyTable.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import { getAllAnswers } from '$lib/db';
	import { calculateCalibration, getCalibrationScore } from '$lib/utils/calibration';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { createTitle } from '$lib/utils/title';

	const answersQuery = stateQuery(() => getAllAnswers());
	const answers = $derived(answersQuery.current);

	const results = $derived.by(() => {
		if (!answers) return;

		return calculateCalibration(answers);
	});

	const score = $derived(results ? getCalibrationScore(results) : 0);
</script>

<svelte:head><title>{createTitle('Results')}</title></svelte:head>

<div class="flex flex-col gap-8">
	<Heading level={2}>Results</Heading>
	{#if results}
		<div class="flex flex-col gap-8">
			<Paragraph>Your calibration score is {score}/100.</Paragraph>
			<AccuracyChart accuracyMap={results} />
			<AccuracyTable accuracyMap={results} />
		</div>
	{/if}
</div>
