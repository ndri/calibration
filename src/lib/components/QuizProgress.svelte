<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		progress: number;
		total: number;
	}

	const { progress, total }: Props = $props();
</script>

<div class="flex items-center gap-2 text-sm whitespace-nowrap text-main-500 dark:text-main-400">
	<span>
		{progress}/{total}
	</span>
	<ProgressBar {progress} {total} size="sm" />
	<span>
		{Math.round((progress / total) * 100)}%
	</span>
</div>
