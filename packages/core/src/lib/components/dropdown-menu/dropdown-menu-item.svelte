<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		value,
		...restProps
	}: ComponentProps<typeof ArkMenu.Item> = $props();
</script>

<ArkMenu.Item
	bind:ref
	{value}
	data-slot="dropdown-menu-item"
	class={cn(
		"relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-[var(--ui-accent)] data-[highlighted]:text-[var(--ui-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ArkMenu.Item>
