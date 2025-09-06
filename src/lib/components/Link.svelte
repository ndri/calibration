<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowTopRightOnSquareIcon as SmIcon } from '@sidekickicons/svelte/16/solid';
	import { ArrowTopRightOnSquareIcon as MdIcon } from '@sidekickicons/svelte/20/solid';
	import { ArrowTopRightOnSquareIcon as LgIcon } from '@sidekickicons/svelte/24/solid';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		href: string;
		newTab?: boolean;
		iconSize?: 'sm' | 'md' | 'lg';
		class?: ClassValue;
		children: Snippet;
	}

	const { href, newTab, children, class: className, iconSize = 'sm' }: Props = $props();
</script>

<a
	{href}
	class={[
		'inline-flex items-center',
		'underline',
		'text-orange-600 hover:text-orange-700',
		'dark:text-orange-400 dark:hover:text-orange-300',
		iconSize === 'sm' && 'gap-0.5',
		iconSize === 'md' && 'gap-1',
		iconSize === 'lg' && 'gap-1',
		className
	]}
	target={newTab ? '_blank' : undefined}
	rel={newTab ? 'noopener noreferrer' : undefined}
>
	{@render children()}
	{#if newTab}
		{#if iconSize === 'md'}
			<MdIcon class="size-5" />
		{:else if iconSize === 'lg'}
			<LgIcon class="size-6" />
		{:else if iconSize === 'sm'}
			<SmIcon class="size-4" />
		{/if}
	{/if}
</a>
