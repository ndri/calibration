<script lang="ts">
	import AccuracyChart from '$lib/components/AccuracyChart.svelte';
	import AccuracyTable from '$lib/components/AccuracyTable.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import { getAllAnswers, getAnswersForQuestionSet } from '$lib/db';
	import { calculateCalibration } from '$lib/utils/calibration';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { createTitle } from '$lib/utils/title';

	const answersQuery = stateQuery(() => getAllAnswers());
	const answers = $derived(answersQuery.current);

	const results = $derived.by(() => {
		if (!answers) return;

		return calculateCalibration(answers);
	});
</script>

<svelte:head><title>{createTitle('Results')}</title></svelte:head>

<div class="flex flex-col gap-8">
	<Heading level={2}>Results</Heading>
	{#if results}
		<div class="flex flex-col gap-8">
			<AccuracyChart accuracyMap={results} />
			<AccuracyTable accuracyMap={results} />
		</div>
	{/if}
</div>
