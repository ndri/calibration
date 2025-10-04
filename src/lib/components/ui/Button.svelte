<script lang="ts" module>
	export type ButtonComponentRef = HTMLAnchorElement | HTMLButtonElement | undefined;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, MouseEventHandler } from 'svelte/elements';
	import type { Heroicon } from '$lib/Heroicon';
	import { createShortcut, type MousetrapKey } from '$lib/utils/mousetrap';

	interface Props {
		variant?: 'primary' | 'secondary' | 'text';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		type?: 'button' | 'submit' | 'reset' | null;
		disabled?: boolean | null;
		href?: string;
		label?: string;
		onclick?: MouseEventHandler<HTMLButtonElement> | null;
		children?: Snippet;
		class?: ClassValue | null;
		LeftIcon?: Heroicon;
		RightIcon?: Heroicon;
		shortcutKey?: MousetrapKey;
		ref?: ButtonComponentRef;
		[key: string]: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		href,
		label,
		onclick,
		children,
		class: className,
		LeftIcon,
		RightIcon,
		shortcutKey,
		ref = $bindable(),
		...props
	}: Props = $props();

	const sizeClasses = {
		xs: ['text-xs gap-1.5 rounded-sm', variant !== 'text' && 'px-2 py-1.5'],
		sm: ['text-sm gap-1.5 rounded-sm', variant !== 'text' && 'px-2 py-1'],
		md: ['text-sm gap-1.5 rounded-md', variant !== 'text' && 'px-3 py-1.5'],
		lg: ['text-sm gap-2 rounded-md', variant !== 'text' && 'px-3 py-2'],
		xl: ['text-base gap-2 rounded-md', variant !== 'text' && 'px-3.5 py-2.5']
	} as const;

	const variantClasses = {
		primary: [
			'bg-accent-600 dark:bg-accent-900',
			'hover:bg-accent-700 dark:hover:bg-accent-800',
			'active:bg-accent-800 dark:active:bg-accent-700',
			'text-white'
		],
		secondary: [
			'bg-white dark:bg-main-800',
			'hover:bg-main-100 dark:hover:bg-main-700',
			'active:bg-main-200 dark:active:bg-main-600',
			'text-main-900 dark:text-white',
			'ring-1 ring-inset ring-main-300 dark:ring-0'
		],
		text: ['hover:bg-main-200', 'dark:hover:bg-main-800']
	} as const;

	const buttonClasses = [
		'group/button',
		sizeClasses[size],
		variantClasses[variant],
		'font-semibold inline-flex items-center justify-center whitespace-nowrap cursor-pointer',
		'focus-outline',
		'disabled:opacity-50 disabled:cursor-not-allowed',
		className
	];

	const iconClasses = {
		primary: [
			'text-accent-200 dark:text-accent-400',
			'group-hover/button:text-accent-300 dark:group-hover/button:text-accent-400'
		],
		secondary: [
			'text-main-400 dark:text-main-500',
			'group-hover/button:text-main-500 dark:group-hover/button:text-main-400'
		],
		text: [
			'text-main-400 group-hover/button:text-main-500',
			'dark:text-main-500 dark:group-hover/button:text-main-400'
		]
	};

	$effect(() => {
		if (shortcutKey && ref) {
			return createShortcut(shortcutKey, () => {
				if (disabled) return;
				ref?.click();
			});
		}
	});
</script>

{#snippet contents()}
	{#if LeftIcon}
		<LeftIcon class={iconClasses[variant]} />
	{/if}
	{#if label}
		{label}
	{/if}
	{@render children?.()}
	{#if RightIcon}
		<RightIcon class={iconClasses[variant]} />
	{/if}
{/snippet}

{#if href && !disabled}
	<a {href} class={buttonClasses} bind:this={ref} {...props}>
		{@render contents()}
	</a>
{:else}
	<button {type} class={buttonClasses} {disabled} {onclick} bind:this={ref} {...props}>
		{@render contents()}
	</button>
{/if}
