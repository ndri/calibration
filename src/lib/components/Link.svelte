<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		newTab?: boolean;
		children: Snippet;
	}

	const { href, newTab, children }: Props = $props();
</script>

<a
	{href}
	class="underline hover:opacity-70"
	target={newTab ? '_blank' : undefined}
	rel={newTab ? 'noopener noreferrer' : undefined}
>
	{@render children()}
</a>
