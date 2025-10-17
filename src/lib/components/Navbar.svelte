<script lang="ts">
	import { Bars3Icon, XMarkIcon } from '@sidekickicons/svelte/24/outline';
	import SidebarContents from './SidebarContents.svelte';
	import Button from './ui/Button.svelte';
	import { on } from 'svelte/events';
	import { onMount } from 'svelte';

	const TRANSITION_DURATION = 150;

	let sidebarOpenPercentage = $state(0);
	let sidebarElement = $state<HTMLElement | null>(null);

	let holdGesture = $state(false);
	let openGesture = $state(false);

	function openSidebarToPercentage(percentage: number) {
		sidebarOpenPercentage = 1;
		setTimeout(() => {
			sidebarOpenPercentage = percentage;
		}, 0);
	}

	function openSidebar() {
		openSidebarToPercentage(100);
	}

	function closeSidebar() {
		sidebarOpenPercentage = 1;
		setTimeout(() => {
			sidebarOpenPercentage = 0;
		}, TRANSITION_DURATION);
	}

	onMount(() => {
		[
			on(document, 'touchstart', (e) => {
				const touchStartX = e.touches[0].clientX;

				if (sidebarOpenPercentage === 0 && touchStartX < 25) {
					holdGesture = true;
					setTimeout(() => {
						if (holdGesture) {
							openGesture = true;
							openSidebarToPercentage(10);
						}
					}, 200);
				}

				if (
					sidebarElement &&
					sidebarOpenPercentage === 100 &&
					touchStartX > sidebarElement?.clientWidth - 25
				) {
					openGesture = true;
				}
			}),
			on(document, 'touchend', () => {
				holdGesture = false;

				if (openGesture) {
					openGesture = false;
					if (sidebarOpenPercentage < 25) {
						closeSidebar();
					} else {
						openSidebar();
					}
				}
			}),
			on(document, 'touchmove', (e) => {
				const touchMoveX = e.touches[0].clientX;

				if (openGesture && sidebarElement) {
					sidebarOpenPercentage = Math.min(
						100,
						Math.max(0, touchMoveX / sidebarElement.clientWidth) * 100
					);
				}
			})
		].forEach((removeListener) => removeListener());
	});
</script>

<header
	class="fixed top-0 z-30 flex w-full justify-center bg-main-50 p-4 lg:hidden dark:bg-main-900"
>
	<div class="flex w-full max-w-3xl items-center gap-3">
		<Button
			size="xl"
			variant="text"
			LeftIcon={sidebarOpenPercentage ? XMarkIcon : Bars3Icon}
			onclick={sidebarOpenPercentage ? closeSidebar : openSidebar}
			class="p-1"
			aria-label={sidebarOpenPercentage ? 'Close sidebar' : 'Open sidebar'}
		/>
		<h1 class="grow text-xl font-medium">Calibration Practice</h1>
	</div>
</header>

<aside class={['h-screen pt-4 pl-4', 'hidden lg:flex']}>
	<SidebarContents onclick={closeSidebar} />
</aside>

{#if sidebarOpenPercentage}
	<button
		class={[
			'fixed inset-0 z-10 cursor-default bg-main-500/75 lg:hidden dark:bg-main-950/85',
			!openGesture && 'transition-opacity'
		]}
		style="opacity: {sidebarOpenPercentage}%; transition-duration: {TRANSITION_DURATION}ms"
		aria-hidden="true"
		aria-label="Close sidebar"
		onclick={closeSidebar}
		tabindex="-1"
	></button>
	<aside
		class={[
			'fixed left-0 z-20 h-screen px-4 pt-[68px]',
			'bg-main-50 dark:bg-main-900',
			'lg:hidden'
		]}
		style="transform: translateX(-{100 - sidebarOpenPercentage}%); transition-duration: {openGesture
			? 0
			: TRANSITION_DURATION}ms"
		bind:this={sidebarElement}
	>
		<SidebarContents onclick={closeSidebar} hideTitle />
	</aside>
{/if}
