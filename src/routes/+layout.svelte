<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Calibration Practice</title>
	<link rel="icon" href="/favicon.svg" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
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
