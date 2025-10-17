<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';

	let { children } = $props();

	export const ssr = false;
</script>

<svelte:head>
	<title>Calibration Practice</title>
	<link rel="icon" href="/favicon.svg" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#1c1917" media="(prefers-color-scheme: dark)" />
</svelte:head>

<div
	class={[
		'relative flex h-full flex-col items-center justify-start p-0',
		'md:justify-center',
		'lg:flex-row lg:items-start',
		'bg-white text-main-800 lg:bg-main-50',
		'dark:bg-main-950 dark:text-main-200 lg:dark:bg-main-900'
	]}
>
	<Navbar />
	<main class="h-screen w-full overflow-y-auto p-0 lg:p-4" tabindex="-1">
		<div
			class={[
				'@container',
				'flex min-h-full justify-center p-4 pt-24',
				'border-main-200 bg-white',
				'dark:border-main-800 dark:bg-main-950',
				'lg:rounded-lg lg:border lg:p-16'
			]}
		>
			<div class="flex min-h-full w-full max-w-3xl flex-col items-center gap-8">
				{@render children()}
			</div>
		</div>
	</main>
</div>
