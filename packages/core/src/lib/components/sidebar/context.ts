import { getContext } from "svelte";
import type { Writable } from "svelte/store";

type Side = "left" | "right";
type Collapsible = "offcanvas" | "icon" | "none";

export interface SidebarState {
	open: boolean;
	side: Side;
	collapsible: Collapsible;
}

export interface SidebarContext {
	state: Writable<SidebarState>;
	toggle: () => void;
	setOpen: (value: boolean) => void;
}

export function getSidebar(): SidebarContext {
	const context = getContext<SidebarContext>("sidebar");
	if (!context) {
		throw new Error("Sidebar components must be used within a <Sidebar.Root>");
	}
	return context;
}
