<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const tabsListVariants = tv({
		base: "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
		variants: {
			variant: {
				default: "bg-muted text-muted-foreground",
				line: "gap-2 bg-transparent p-0",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type TabsListVariant = VariantProps<typeof tabsListVariants>["variant"];
</script>

<script lang="ts">
	import { Tabs as ArkTabs } from "@ark-ui/svelte/tabs";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkTabs.List> = $props();
</script>

<ArkTabs.List
	bind:ref
	data-slot="tabs-list"
	class={cn(
		"bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ArkTabs.List>
