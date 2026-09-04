<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "horizontal",
		"data-slot": dataSlot = "separator",
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		orientation?: "horizontal" | "vertical";
	} = $props();
</script>

<div
	bind:this={ref}
	role="separator"
	data-slot={dataSlot}
	data-orientation={orientation}
	aria-orientation={orientation}
	class={cn(
		"shrink-0 bg-[var(--ui-border)]",
		orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
		className
	)}
	{...restProps}
/>
