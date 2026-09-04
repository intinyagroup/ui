<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div
	data-slot="sidebar-group"
	class={cn("relative flex w-full min-w-0 flex-col p-2", className)}
	{...restProps}
>
	{@render children?.()}
</div>
