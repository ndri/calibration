<script lang="ts">
	import { getCalibrationScore, type AccuracyMap } from '$lib/utils/calibration';
	import { StarIcon as EmptyStarIcon } from '@sidekickicons/svelte/24/outline';
	import { StarIcon as FullStarIcon } from '@sidekickicons/svelte/24/solid';

	interface Props {
		accuracyMap: AccuracyMap;
	}

	const { accuracyMap }: Props = $props();

	const score = $derived(getCalibrationScore(accuracyMap));

	const TOTAL_STARS = 5;

	const numberOfStars = $derived.by(() => {
		if (!accuracyMap) return 0;

		if (score >= 95) return 5;
		if (score >= 85) return 4;
		if (score >= 70) return 3;
		if (score >= 50) return 2;
		if (score >= 25) return 1;

		return 0;
	});

	const starColourClass = $derived.by(() => {
		if (!accuracyMap) return 'text-main-500 dark:text-main-400';

		if (numberOfStars >= 5) return 'text-cyan-500 dark:text-cyan-600';
		if (numberOfStars >= 4) return 'text-green-500 dark:text-green-700';
		if (numberOfStars >= 3) return 'text-yellow-400 dark:text-yellow-600';
		if (numberOfStars >= 2) return 'text-orange-400 dark:text-orange-600';
		if (numberOfStars >= 1) return 'text-red-500 dark:text-red-800';

		return 'text-main-500 dark:text-main-400';
	});
</script>

<div
	class="flex flex-col items-center justify-between gap-8 rounded-xl bg-main-50 p-8 sm:flex-row dark:bg-main-900"
>
	<div class="flex flex-col gap-2">
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
