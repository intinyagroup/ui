<script lang="ts">
	import { Tabs as ArkTabs } from "@ark-ui/svelte/tabs";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		value,
		children,
		...restProps
	}: ComponentProps<typeof ArkTabs.Trigger> = $props();
</script>

<ArkTabs.Trigger
	bind:ref
	{value}
	data-slot="tabs-trigger"
	class={cn(
		"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm cursor-pointer",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ArkTabs.Trigger>
