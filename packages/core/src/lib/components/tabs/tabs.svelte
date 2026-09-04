<script lang="ts">
	import { Tabs as ArkTabs } from "@ark-ui/svelte/tabs";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkTabs.Root> = $props();
</script>

<ArkTabs.Root
	bind:ref
	bind:value
	data-slot="tabs"
	class={cn("flex flex-col gap-2", className)}
	{...restProps}
>
	{@render children?.()}
</ArkTabs.Root>
