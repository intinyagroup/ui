<script lang="ts">
	import { Select as ArkSelect } from "@ark-ui/svelte/select";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkSelect.ItemGroupLabel> = $props();
</script>

<ArkSelect.ItemGroupLabel
	bind:ref
	class={cn("text-muted-foreground px-2 py-1.5 text-xs font-medium", className)}
	{...restProps}
>
	{@render children?.()}
</ArkSelect.ItemGroupLabel>
