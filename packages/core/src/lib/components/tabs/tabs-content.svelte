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
	}: ComponentProps<typeof ArkTabs.Content> = $props();
</script>

<ArkTabs.Content
	bind:ref
	{value}
	data-slot="tabs-content"
	class={cn("flex-1 outline-none", className)}
	{...restProps}
>
	{@render children?.()}
</ArkTabs.Content>
