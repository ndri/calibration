import { onMount } from 'svelte';
import Mousetrap from 'mousetrap';

export type MousetrapKey = Parameters<Mousetrap.MousetrapStatic['bind']>[0];
type MousetrapHandler = Parameters<Mousetrap.MousetrapStatic['bind']>[1];
type MousetrapAction = 'keydown' | 'keyup' | 'keypress';

export function createShortcutOnMount(
	key: MousetrapKey,
	handler: MousetrapHandler,
	action: MousetrapAction = 'keydown'
) {
	onMount(() => createShortcut(key, handler, action));
}

export function createShortcut(
	key: MousetrapKey,
	handler: MousetrapHandler,
	action: MousetrapAction = 'keydown'
) {
	Mousetrap.bind(key, handler, action);
	return () => Mousetrap.unbind(key, action);
}
