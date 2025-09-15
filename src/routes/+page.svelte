<script>
	import CardLink from '$lib/components/CardLink.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { CheckIcon } from '@sidekickicons/svelte/20/solid';

	const scoutMindsetProgressQuery = stateQuery(() => getQuestionSetProgress('Scout Mindset'));
	const scoutMindsetProgress = $derived(scoutMindsetProgressQuery.current);
</script>

<Heading level={1}>Calibration Practice</Heading>

<CardLink href="/scoutmindset" title="Scout Mindset Calibration Quiz">
	{#snippet description()}
		Practice calibrating your confidence with a 40-question quiz adapted from Julia Galef's book,
		<em>The Scout Mindset</em>.
	{/snippet}
	{#snippet footer()}
		{#if scoutMindsetProgress}
			{#if scoutMindsetProgress < 40}
				<ProgressBar progress={scoutMindsetProgress} total={40} size="xs" />
			{:else}
				<div class="flex items-center gap-1 text-green-500">
					<CheckIcon />
					Completed
				</div>
			{/if}
		{/if}
	{/snippet}
</CardLink>

<Paragraph>More coming soon!</Paragraph>
