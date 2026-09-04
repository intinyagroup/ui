<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLElement> & {
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<main
	data-slot="sidebar-inset"
	class={cn(
		"relative flex min-h-svh flex-1 flex-col bg-background",
		"peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</main>
