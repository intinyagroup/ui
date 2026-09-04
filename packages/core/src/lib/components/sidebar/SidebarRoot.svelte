<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { setContext, type Snippet } from "svelte";
	import { writable } from "svelte/store";
	import type { SidebarContext } from "./context.js";

	type Side = "left" | "right";
	type Collapsible = "offcanvas" | "icon" | "none";

	let {
		side = "left",
		collapsible = "offcanvas",
		open = $bindable(true),
		class: className,
		children,
		...restProps
	}: {
		side?: Side;
		collapsible?: Collapsible;
		open?: boolean;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const sidebarState = writable({ open, side, collapsible });
	$effect(() => {
		sidebarState.set({ open, side, collapsible });
	});

	setContext<SidebarContext>("sidebar", {
		state: sidebarState,
		toggle: () => {
			open = !open;
		},
		setOpen: (value: boolean) => {
			open = value;
		},
	});
</script>

<nav
	data-slot="sidebar"
	data-side={side}
	data-collapsible={collapsible}
	data-state={open ? "expanded" : "collapsed"}
	aria-label="sidebar"
	class={cn(
		"group/sidebar relative flex h-svh w-64 flex-col border-r border-border bg-[var(--ui-card)] text-foreground transition-all duration-200 ease-in-out",
		side === "right" && "border-r-0 border-l",
		collapsible === "offcanvas" &&
			(open ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"),
		collapsible === "icon" && (open ? "w-64" : "w-12"),
		collapsible === "none" && "w-64",
		side === "left" && collapsible === "offcanvas" && !open && "absolute z-40",
		side === "right" && collapsible === "offcanvas" && !open && "absolute z-40 right-0",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</nav>
