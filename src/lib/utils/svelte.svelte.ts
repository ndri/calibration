import { untrack } from 'svelte';

export function explicitEffect<T>(fn: () => void, depsFn: () => T): void {
	$effect(() => {
		depsFn();
		untrack(fn);
	});
}
