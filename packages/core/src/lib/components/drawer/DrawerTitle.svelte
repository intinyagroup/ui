<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<h2
	bind:this={ref}
	id="drawer-title"
	data-slot="drawer-title"
	class={cn("text-base font-medium text-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</h2>
