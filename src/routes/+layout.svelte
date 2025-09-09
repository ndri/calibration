<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class={[
		'flex min-h-full justify-center px-8 py-16',
		'bg-main-100 text-main-800',
		'dark:bg-main-800 dark:text-main-100'
	]}
>
	<main class="flex w-full max-w-xl flex-col gap-4">
		{@render children?.()}
	</main>
</div>
