<script lang="ts">
	interface Props {
		accuracyMap: Map<number, { correct: number; total: number }>;
	}

	const { accuracyMap }: Props = $props();

	const yAxis = [
		1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2,
		0.15, 0.1, 0.05, 0.0
	];
	const xAxis = [0.55, 0.65, 0.75, 0.85, 0.95];

	function bubbleColorClass(confidence: number, accuracy: number) {
		const diff = Math.abs(confidence - accuracy);
		if (diff <= 0.1) return 'bg-green-500 dark:bg-green-600';
		if (diff <= 0.2) return 'bg-yellow-500 dark:bg-yellow-600';
		return 'bg-red-500 dark:bg-red-600';
	}
</script>

<div class="flex gap-3">
	<div class="flex w-3 flex-col justify-center text-center">
		<div
			class="flex h-4 origin-left translate-x-1 -translate-y-5 -rotate-90 justify-center text-sm text-nowrap text-main-500 dark:text-main-400"
		>
			...you're right ____ of the time
		</div>
	</div>
	<div class="flex flex-col">
		{#each yAxis as y, i (y)}
			<div class="flex h-7 w-9 items-center justify-end text-sm">{Math.round(y * 100)}%</div>
		{/each}
	</div>
	<div class="flex grow flex-col gap-5 py-4">
		<div class="relative flex flex-col gap-[27px] border-l border-main-300 dark:border-main-700">
			{#each yAxis as y, i (y)}
				<div class="flex items-start justify-end text-sm">
					<div
						class={[
							'h-[1px] w-full',
							'border-t border-main-300 dark:border-main-700',
							i !== yAxis.length - 1 && 'border-dashed'
						]}
					></div>
				</div>
			{/each}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 200 100"
				class="absolute top-0 h-1/2 w-full text-main-300 dark:text-main-600"
				preserveAspectRatio="none"
			>
				<path
					d="M0 100L200 0"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-dasharray="2,2"
				/>
			</svg>
			{#each xAxis as x, i (x)}
				{#if accuracyMap.has(x)}
					{@const { correct, total } = accuracyMap.get(x)!}
					{@const accuracy = correct / total}

					<div
						class={[
							'absolute size-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent-400 dark:bg-accent-800',
							bubbleColorClass(x, accuracy)
						]}
						style="left: {10 + i * 20}%; bottom: {accuracy * 100}%"
					></div>
				{/if}
			{/each}
		</div>
		<div class="relative flex items-center">
			{#each xAxis as x, i (x)}
				<div class="absolute -translate-x-1/2 text-center text-sm" style="left: {10 + i * 20}%">
					{Math.round(x * 100)}%
				</div>
			{/each}
		</div>
		<div class="text-center text-sm text-main-500 dark:text-main-400">
			When you feel ____ sure of your answer...
		</div>
	</div>
</div>
