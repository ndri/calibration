<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Calibration</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class={[
		'flex min-h-full justify-center px-4 py-12 sm:px-8',
		'bg-main-100 text-main-900',
		'dark:bg-main-900 dark:text-main-50'
	]}
>
	<main class="flex w-full max-w-2xl flex-col gap-5">
		{@render children?.()}
	</main>
</div>
