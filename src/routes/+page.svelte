<script>
	import CardLink from '$lib/components/CardLink.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { createTitle } from '$lib/utils/title';
	import { CheckIcon } from '@sidekickicons/svelte/20/solid';

	const scoutMindsetProgressQuery = stateQuery(() => getQuestionSetProgress('Scout Mindset'));
	const scoutMindsetProgress = $derived(scoutMindsetProgressQuery.current);
	const scoutMindsetComplete = $derived(scoutMindsetProgress && scoutMindsetProgress >= 40);
</script>

<svelte:head><title>{createTitle()}</title></svelte:head>

<CardLink
	href={scoutMindsetComplete ? '/scoutmindset/results' : '/scoutmindset'}
	title="Scout Mindset Calibration Quiz"
>
	{#snippet description()}
		Practice calibrating your confidence with a 40-question quiz adapted from Julia Galef's book,
		<em>The Scout Mindset</em>.
	{/snippet}
	{#snippet footer()}
		{#if scoutMindsetProgress}
			{#if scoutMindsetComplete}
				<div class="flex items-center gap-1 text-green-500">
					<CheckIcon />
					Completed
				</div>
			{:else}
				<ProgressBar progress={scoutMindsetProgress} total={40} size="xs" />
			{/if}
		{/if}
	{/snippet}
</CardLink>

<Paragraph>More coming soon!</Paragraph>
