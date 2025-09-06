<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-full justify-center bg-main-100 px-8 py-16 text-main-800">
	<main class="flex w-full max-w-3xl flex-col gap-4">
		{@render children?.()}
	</main>
</div>
