<script>
	import CardLink from '$lib/components/CardLink.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Paragraph from '$lib/components/Paragraph.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { getQuestionSetProgress } from '$lib/db';
	import { stateQuery } from '$lib/utils/stateQuery.svelte';
	import { ArrowRightIcon, CheckIcon } from '@sidekickicons/svelte/20/solid';

	const scoutMindsetProgressQuery = stateQuery(() => getQuestionSetProgress('Scout Mindset'));
	const scoutMindsetProgress = $derived(scoutMindsetProgressQuery.current);
</script>

<Heading level={1}>Calibration Practice</Heading>

<CardLink href="/scoutmindset" title="Scout Mindset Calibration Quiz">
	{#snippet description()}
		Practice calibrating your confidence with a 40-question quiz adapted from Julia Galef's book, <em
		>
			The Scout Mindset
		</em>.
	{/snippet}
</CardLink>

<Paragraph>More coming soon!</Paragraph>
