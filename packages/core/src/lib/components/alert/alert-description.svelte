<script lang="ts">
	import { getContext } from "svelte";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import type { AlertContext } from "./context.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();

	const { descriptionId } = getContext<AlertContext>("alert");
</script>

<p
	bind:this={ref}
	id={descriptionId}
	data-slot="alert-description"
	class={cn(
		"text-sm text-balance text-muted-foreground md:text-pretty [&_p:not(:last-child)]:mb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
