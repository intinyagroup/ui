<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		viewportRef = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		viewportRef?: HTMLDivElement | null;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="scroll-area"
	class={cn("relative overflow-hidden", className)}
	{...restProps}
>
	<div
		bind:this={viewportRef}
		data-slot="scroll-area-viewport"
		class="size-full overflow-auto rounded-[inherit] outline-none"
	>
		{@render children?.()}
	</div>
</div>
