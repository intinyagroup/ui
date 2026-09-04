<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "vertical",
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		orientation?: "vertical" | "horizontal";
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="scroll-area-scrollbar"
	data-orientation={orientation}
	class={cn(
		"flex touch-none select-none transition-colors",
		orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px",
		orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-px",
		className
	)}
	{...restProps}
>
	<div class="bg-border relative flex-1 rounded-full" />
</div>
