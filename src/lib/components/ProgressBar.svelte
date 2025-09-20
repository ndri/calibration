<script lang="ts">
	interface Props {
		progress: number;
		total: number;
		size?: 'sm' | 'md' | 'lg' | 'xs';
	}

	const { progress, total, size = 'md' }: Props = $props();

	let percentage = $derived(Math.round((Math.min(progress, total) / total) * 100));

	const sizeClasses = {
		xs: 'h-1.5',
		sm: 'h-2',
		md: 'h-3',
		lg: 'h-4'
	}[size];
</script>

<div class="relative w-full">
	<div class={['relative w-full rounded-lg bg-main-200 dark:bg-main-800', sizeClasses]}>
		<div
			class={[
				'absolute top-0 left-0 h-full rounded-lg bg-accent-500 dark:bg-accent-700',
				'transition-[width] duration-300 ease-out'
			]}
			style="width: {percentage}%;"
		></div>
	</div>
</div>
