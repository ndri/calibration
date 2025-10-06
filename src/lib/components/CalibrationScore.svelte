<script lang="ts">
	import {
		generateShareMessage,
		getCalibrationScore,
		getStarCount,
		TOTAL_STARS,
		type AccuracyMap
	} from '$lib/utils/calibration';
	import { StarIcon as EmptyStarIcon } from '@sidekickicons/svelte/24/outline';
	import { StarIcon as FullStarIcon } from '@sidekickicons/svelte/24/solid';
	import Button from './ui/Button.svelte';
	import { DocumentDuplicateIcon } from '@sidekickicons/svelte/24/solid';
	import SimpleDialog from './ui/SimpleDialog.svelte';
	import { shareOnBluesky } from '$lib/utils/share';
	import BlueskyIcon from './icons/BlueskyIcon.svelte';

	interface Props {
		accuracyMap: AccuracyMap;
		quizName?: string;
	}

	const { accuracyMap, quizName }: Props = $props();

	const score = $derived(getCalibrationScore(accuracyMap));

	const numberOfStars = $derived(getStarCount(score));

	const starColourClass = $derived.by(() => {
		if (numberOfStars >= 5) return 'text-cyan-500 dark:text-cyan-600';
		if (numberOfStars >= 4) return 'text-green-500 dark:text-green-700';
		if (numberOfStars >= 3) return 'text-yellow-400 dark:text-yellow-600';
		if (numberOfStars >= 2) return 'text-orange-400 dark:text-orange-600';
		if (numberOfStars >= 1) return 'text-red-500 dark:text-red-800';

		return 'text-main-500 dark:text-main-400';
	});

	let alertDialog = $state<SimpleDialog>();
	let alertDialogTitle = $state<string>('');
	let alertDialogDescription = $state<string>('');
</script>

<div class="flex flex-col gap-8 rounded-xl bg-main-50 p-8 dark:bg-main-900">
	<div class="flex flex-col items-center justify-between gap-8 @lg:flex-row">
		<div class="flex flex-col items-center gap-4 text-center @lg:items-start @lg:gap-2">
			<div class="text-sm text-main-500 dark:text-main-400">Your calibration score is</div>
			<div class="flex items-end gap-1.5">
				<span class="text-5xl font-semibold">{score}</span>
				<span class="text-base text-main-500 dark:text-main-400">/ 100</span>
			</div>
		</div>
		<div class="flex gap-0.5">
			{#each Array(TOTAL_STARS) as _, i (i)}
				{#if i < numberOfStars}
					<FullStarIcon class={['size-12!', starColourClass]} />
				{:else}
					<EmptyStarIcon class="size-12! text-main-300 dark:text-main-600" />
				{/if}
			{/each}
		</div>
	</div>
	<div class="grid grid-cols-1 gap-4 @lg:grid-cols-2">
		<Button
			size="xl"
			variant="secondary"
			LeftIcon={DocumentDuplicateIcon}
			onclick={() => {
				const shareMessage = generateShareMessage(accuracyMap, { quizName });
				navigator.clipboard.writeText(shareMessage);
				alertDialogTitle = 'Share text copied!';
				alertDialogDescription = shareMessage;
				alertDialog?.open();
			}}
		>
			Copy share text
		</Button>
		<Button
			size="xl"
			variant="custom"
			class="bg-[#1185FE] text-white hover:bg-[#0F77E4] active:bg-[#0D6ACB]"
			iconClass="text-white"
			LeftIcon={BlueskyIcon}
			onclick={() => {
				const shareMessage = generateShareMessage(accuracyMap, { quizName });
				shareOnBluesky(shareMessage);
			}}
		>
			Share on Bluesky
		</Button>
	</div>
</div>

<SimpleDialog
	bind:this={alertDialog}
	title={alertDialogTitle}
	description={alertDialogDescription}
	buttons={[
		{
			label: 'Alrighty',
			onclick: () => alertDialog?.close()
		}
	]}
/>
