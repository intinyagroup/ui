<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLUListElement> & {
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<ul
	data-slot="sidebar-menu"
	class={cn("flex w-full min-w-0 flex-col gap-1", className)}
	{...restProps}
>
	{@render children?.()}
</ul>
