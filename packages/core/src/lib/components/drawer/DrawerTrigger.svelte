<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLButtonAttributes> = $props();

	const drawerState = getContext<{
		get open(): boolean;
		set open(v: boolean);
		setTrigger: (el: HTMLElement) => void;
	}>("drawer-state");

	// Store the trigger element for focus restoration on close
	$effect(() => {
		if (ref) {
			drawerState.setTrigger(ref);
		}
	});

	function handleClick() {
		drawerState.open = true;
	}
</script>

<button
	bind:this={ref}
	data-slot="drawer-trigger"
	class={cn(className)}
	onclick={handleClick}
	{...restProps}
>
	{@render children?.()}
</button>
