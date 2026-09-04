<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		ratio = 1,
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		ratio?: number;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="aspect-ratio"
	class={cn("relative w-full", className)}
	style="padding-bottom: {(1 / ratio) * 100}%;"
	{...restProps}
>
	<div class="absolute inset-0 size-full">
		{@render children?.()}
	</div>
</div>
