<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkMenu.ItemGroupLabel> = $props();
</script>

<ArkMenu.ItemGroupLabel
	bind:ref
	data-slot="dropdown-menu-group-heading"
	class={cn("text-muted-foreground px-2 py-1.5 text-xs font-medium", className)}
	{...restProps}
>
	{@render children?.()}
</ArkMenu.ItemGroupLabel>
