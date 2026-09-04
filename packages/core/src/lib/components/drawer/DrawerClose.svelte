<script lang="ts">
	import { getContext } from "svelte";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		type = "button",
		children,
		...restProps
	}: WithElementRef<HTMLButtonAttributes> = $props();

	const drawerState = getContext<{
		get open(): boolean;
		set open(v: boolean);
	}>("drawer-state");

	function handleClick() {
		drawerState.open = false;
	}
</script>

<button
	bind:this={ref}
	data-slot="drawer-close"
	class={cn(className)}
	{type}
	onclick={handleClick}
	{...restProps}
>
	{@render children?.()}
</button>
