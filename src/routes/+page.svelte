<script>
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

<a
	class={[
		'flex flex-col gap-4',
		'rounded-lg p-6',
		'bg-white dark:bg-main-800',
		'hover:bg-main-50 dark:hover:bg-main-700'
	]}
	href="/scoutmindset"
>
	<div class="flex items-center gap-2">
		<Heading level={2}>Scout Mindset Calibration Quiz</Heading>
		<ArrowRightIcon class="text-main-400 dark:text-main-500" />
	</div>
	<Paragraph>
		Practice calibrating your confidence with a 40-question quiz adapted from Julia Galef's book, <em
		>
			The Scout Mindset
		</em>.
	</Paragraph>
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
</a>

<Paragraph>More coming soon!</Paragraph>
