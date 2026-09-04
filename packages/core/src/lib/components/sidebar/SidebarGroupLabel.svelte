<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { getSidebar } from "./context.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> & {
		class?: string;
		children?: Snippet;
	} = $props();

	const sidebar = getSidebar();
	let collapsed = $state(false);

	sidebar.state.subscribe((s) => {
		collapsed = !s.open;
	});
</script>

<h3
	data-slot="sidebar-group-label"
	data-state={collapsed ? "collapsed" : "expanded"}
	class={cn(
		"flex h-8 shrink-0 items-center gap-2 overflow-hidden rounded-md px-2 text-xs font-medium text-muted-foreground transition-all duration-200",
		collapsed && "justify-center px-0 opacity-0 group-hover/sidebar:px-2 group-hover/sidebar:opacity-100",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</h3>
