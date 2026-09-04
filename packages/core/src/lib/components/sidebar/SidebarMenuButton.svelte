<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { getSidebar } from "./context.js";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from "svelte/elements";

	let {
		variant = "default",
		size = "default",
		isActive = false,
		class: className,
		href,
		children,
		...restProps
	}: {
		variant?: "default" | "ghost";
		size?: "default" | "sm" | "lg";
		isActive?: boolean;
		class?: string;
		href?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const sidebar = getSidebar();
	let collapsed = $state(false);

	sidebar.state.subscribe((s) => {
		collapsed = !s.open;
	});
</script>

{#snippet buttonContent()}
	<span
		class={cn(
			"flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground transition-colors duration-200",
			variant === "ghost" && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
			"group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2",
			"[&>span:last-child]:truncate [&>span:last-child]:text-sm",
			collapsed && "justify-center",
			className
		)}
	>
		{@render children?.()}
	</span>
{/snippet}

{#if href}
	<a
		data-slot="sidebar-menu-button"
		data-active={isActive}
		data-size={size}
		{href}
		class={cn(
			"flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
			isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
			collapsed && "justify-center",
			size === "sm" && "h-7 text-xs",
			size === "lg" && "h-12 text-sm",
			className
		)}
	>
		{@render buttonContent()}
	</a>
{:else}
	<button
		data-slot="sidebar-menu-button"
		data-active={isActive}
		data-size={size}
		type="button"
		class={cn(
			"flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
			isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
			collapsed && "justify-center",
			size === "sm" && "h-7 text-xs",
			size === "lg" && "h-12 text-sm",
			className
		)}
		{...restProps}
	>
		{@render buttonContent()}
	</button>
{/if}
