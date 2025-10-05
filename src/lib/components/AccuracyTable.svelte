<script lang="ts">
	interface Props {
		accuracyMap: Map<number, { correct: number; total: number }>;
	}

	const { accuracyMap }: Props = $props();

	const confidences = [0.55, 0.65, 0.75, 0.85, 0.95];
</script>

<div class="flex justify-center">
	<table
		class={[
			'w-full max-w-md',
			'[&_*]:border-main-200 [&_*]:dark:border-main-700 [&_th,td]:border',
			'[&_th,td]:first-of-type:border-l-0 [&_th,td]:last-of-type:border-r-0',
			'[&_tr:first-child>th]:border-t-0 [&_tr:last-child>td]:border-b-0',
			'[&_th,td]:w-1/3 [&_th,td]:p-2'
		]}
	>
		<thead class="font-bold">
			<tr class="border-b-3 text-center">
				<th>Confidence</th>
				<th>Correct / Total</th>
				<th>Accuracy</th>
			</tr>
		</thead>
		<tbody>
			{#each confidences as confidence}
				{@const correct = accuracyMap.get(confidence)?.correct ?? 0}
				{@const total = accuracyMap.get(confidence)?.total ?? 0}
				{@const accuracy = (correct / total) * 100}
				<tr class="text-center text-sm [&>td]:border">
					<td>{Math.round(confidence * 100)}%</td>
					<td>{correct} / {total}</td>
					<td class="font-bold">
						{#if isNaN(accuracy)}
							N/A
						{:else}
							{Math.round(accuracy)}%
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
