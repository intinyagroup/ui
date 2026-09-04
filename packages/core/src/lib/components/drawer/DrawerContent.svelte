<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import { cn } from "$lib/utils.js";
	import DrawerOverlay from "./DrawerOverlay.svelte";

	let {
		ref = $bindable(null),
		class: className,
		children
	}: {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
	} = $props();

	const drawerState = getContext<{
		get open(): boolean;
		set open(v: boolean);
		direction: "top" | "right" | "bottom" | "left";
	}>("drawer-state");

	const directionStyles: Record<string, { position: string; transform: string; openTransform: string }> = {
		top: {
			position: "top-0 left-0 right-0",
			transform: "-translate-y-full",
			openTransform: "translate-y-0"
		},
		bottom: {
			position: "bottom-0 left-0 right-0",
			transform: "translate-y-full",
			openTransform: "translate-y-0"
		},
		left: {
			position: "left-0 top-0 bottom-0",
			transform: "-translate-x-full",
			openTransform: "translate-x-0"
		},
		right: {
			position: "right-0 top-0 bottom-0",
			transform: "translate-x-full",
			openTransform: "translate-x-0"
		}
	};

	let styles = $derived(directionStyles[drawerState.direction] || directionStyles.bottom);
</script>

{#if drawerState.open}
	<DrawerOverlay />

	<div
		bind:this={ref}
		role="dialog"
		aria-modal="true"
		aria-labelledby="drawer-title"
		aria-describedby="drawer-description"
		data-slot="drawer-content"
		data-direction={drawerState.direction}
		class={cn(
			"fixed z-50 flex flex-col bg-popover text-sm text-popover-foreground shadow-lg",
			"transition-transform duration-300 ease-in-out",
			styles.position,
			drawerState.open ? styles.openTransform : styles.transform,
			"max-h-full",
			drawerState.direction === "top" && "w-full",
			drawerState.direction === "bottom" && "w-full",
			drawerState.direction === "left" && "h-full w-3/4 max-w-sm",
			drawerState.direction === "right" && "h-full w-3/4 max-w-sm",
			className
		)}
	>
		{@render children?.()}
	</div>
{/if}
