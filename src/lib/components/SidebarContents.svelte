<script lang="ts">
	import { page } from '$app/state';
	import {
		CircleStackIcon,
		HomeIcon,
		QuestionMarkCircleIcon
	} from '@sidekickicons/svelte/20/solid';
	import SidebarItem from './SidebarItem.svelte';

	interface Props {
		hideTitle?: boolean;
		onclick?: () => void;
	}

	const { hideTitle, onclick }: Props = $props();

	const currentPath = $derived(page.url.pathname);

	const menuItems = [
		{
			text: 'Home',
			href: '/',
			Icon: HomeIcon
		},
		{
			text: 'Data',
			href: '/data',
			Icon: CircleStackIcon
		},
		{
			text: 'Help',
			href: '/help',
			Icon: QuestionMarkCircleIcon
		}
	];
</script>

<div class="flex h-full min-w-64 flex-col gap-2">
	{#if !hideTitle}
		<div class="flex items-center gap-3 px-4 pt-4">
			<img src="/logo.svg" alt="Calibration Practice logo" class="h-5 w-5 dark:hidden" />
			<h1 class="text-xl font-medium">Calibration Practice</h1>
		</div>
	{/if}
	<nav class="flex flex-col gap-1.5 p-2">
		{#each menuItems as menuItem}
			<SidebarItem {...menuItem} active={currentPath === menuItem.href} {onclick} />
		{/each}
	</nav>
</div>
