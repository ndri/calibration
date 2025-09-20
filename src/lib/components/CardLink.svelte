<script lang="ts">
	import type { Snippet } from 'svelte';
	import Heading from './Heading.svelte';
	import { ArrowRightIcon } from '@sidekickicons/svelte/20/solid';
	import Paragraph from './Paragraph.svelte';

	interface Props {
		href: string;
		title: string;
		description: string | Snippet;
		footer?: Snippet;
	}

	const { href, title, description, footer }: Props = $props();
</script>

<a
	class={[
		'group/card-link',
		'flex flex-col gap-4',
		'rounded-lg p-6',
		'bg-main-50 dark:bg-main-900',
		'hover:bg-main-100 dark:hover:bg-main-800',
		'active:bg-main-200 dark:active:bg-main-700'
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
	{@render footer?.()}
</a>
