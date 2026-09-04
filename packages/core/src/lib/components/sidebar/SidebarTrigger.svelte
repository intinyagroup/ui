<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { getSidebar } from "./context.js";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLButtonAttributes & {
		class?: string;
		children?: Snippet;
	} = $props();

	const sidebar = getSidebar();
</script>

<button
	data-slot="sidebar-trigger"
	type="button"
	class={cn(
		"inline-flex size-8 items-center justify-center rounded-md text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
		className
	)}
	onclick={sidebar.toggle}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-4"
		>
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
		<span class="sr-only">Toggle Sidebar</span>
	{/if}
</button>
