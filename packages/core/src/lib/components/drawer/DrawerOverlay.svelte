<script lang="ts">
	import { getContext } from "svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className
	}: {
		ref?: HTMLElement | null;
		class?: string;
	} = $props();

	const drawerState = getContext<{
		get open(): boolean;
		set open(v: boolean);
	}>("drawer-state");

	function handleClick() {
		drawerState.open = false;
	}
</script>

{#if drawerState.open}
	<div
		bind:this={ref}
		aria-hidden="true"
		data-slot="drawer-overlay"
		class={cn(
			"fixed inset-0 z-50 bg-black/50",
			"transition-opacity duration-300",
			drawerState.open ? "opacity-100" : "opacity-0",
			className
		)}
		onclick={handleClick}
		onkeydown={(e) => {
			if (e.key === "Escape") drawerState.open = false;
		}}
	>
	</div>
{/if}
