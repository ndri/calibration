<script lang="ts">
	import type { Snippet } from 'svelte';
	import Heading from './Heading.svelte';
	import { ArrowRightIcon } from '@sidekickicons/svelte/20/solid';
	import Paragraph from './Paragraph.svelte';

	interface Props {
		href: string;
		title: string;
		description: string | Snippet;
	}

	const { href, title, description }: Props = $props();
</script>

<a
	class={[
		'group/card-link',
		'flex flex-col gap-4',
		'rounded-lg p-6',
		'bg-white dark:bg-main-800',
		'hover:bg-main-50 dark:hover:bg-main-700',
		'active:bg-main-200 dark:active:bg-main-600'
	]}
	{href}
>
	<div class="flex items-center gap-2">
		<Heading level={2}>{title}</Heading>
		<ArrowRightIcon
			class={[
				'text-main-400 dark:text-main-500',
				'group-hover/card-link:text-main-500 dark:group-hover/card-link:text-main-400'
			]}
		/>
	</div>
	<Paragraph>
		{#if typeof description === 'string'}
			{description}
		{:else}
			{@render description()}
		{/if}
	</Paragraph>
</a>
