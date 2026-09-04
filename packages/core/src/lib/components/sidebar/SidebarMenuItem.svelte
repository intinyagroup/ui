<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLLIElement> & {
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<li
	data-slot="sidebar-menu-item"
	class={cn("group/menu-item relative", className)}
	{...restProps}
>
	{@render children?.()}
</li>
