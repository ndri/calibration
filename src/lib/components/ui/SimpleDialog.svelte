<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';

	interface Props {
		title: string;
		description: string;
		buttons: ComponentProps<typeof Button>[];
	}

	let { title, description, buttons }: Props = $props();

	let dialog = $state<Dialog>();

	export function open() {
		dialog?.open();
	}
	export function close() {
		dialog?.close();
	}
</script>

{#snippet body()}
	<div class="text-center sm:text-left">
		<h3 class="text-base font-semibold" id="modal-title">
			{title}
		</h3>
		<div class="mt-2">
			<p class="text-sm whitespace-pre-line text-main-500 dark:text-main-400">
				{description}
			</p>
		</div>
	</div>
{/snippet}

{#snippet footer()}
	{#each buttons as buttonProps}
		<Button {...buttonProps} class="w-full sm:w-auto" />
	{/each}
{/snippet}

<Dialog bind:this={dialog} {body} {footer} />
