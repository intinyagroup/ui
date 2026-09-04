<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLLabelAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLLabelAttributes & {
		ref?: HTMLLabelElement | null;
	} = $props();
</script>

<label
	bind:this={ref}
	data-slot="label"
	class={cn(
		"gap-2 text-sm leading-none font-medium text-[var(--ui-foreground)] flex items-center select-none disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</label>
