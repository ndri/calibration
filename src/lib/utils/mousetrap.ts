import { onMount } from 'svelte';
import Mousetrap from 'mousetrap';

type MousetrapKey = Parameters<Mousetrap.MousetrapStatic['bind']>[0];
type MousetrapHandler = Parameters<Mousetrap.MousetrapStatic['bind']>[1];

export const createShortcut = (
	key: MousetrapKey,
	handler: MousetrapHandler,
	action: 'keydown' | 'keyup' | 'keypress' = 'keydown'
) => {
	console.log('createShortcut', key, handler, action);
	onMount(() => {
		Mousetrap.bind(key, handler, action);
		return () => Mousetrap.unbind(key, action);
	});
};
