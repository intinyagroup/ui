import { getContext } from 'svelte';

export const TAB_BAR_KEY = Symbol('intinya-tabbar');

export type TabBarContextValue = {
	/** Reactive getter for the parent TabBar's active value. */
	readonly value: string | number;
	/** Sets the parent TabBar's active value (used by TabBarItem's default click). */
	setValue: (v: string | number) => void;
};

export function getTabBar(): TabBarContextValue | undefined {
	return getContext<TabBarContextValue | undefined>(TAB_BAR_KEY);
}
