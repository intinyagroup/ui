<script lang="ts">
	import { Accordion as ArkAccordion } from "@ark-ui/svelte/accordion";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkAccordion.ItemContent> = $props();
</script>

<ArkAccordion.ItemContent
	bind:ref
	data-slot="accordion-content"
	class={cn(
		"overflow-hidden text-sm transition-all pb-4 pt-0 text-[var(--ui-muted-foreground)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ArkAccordion.ItemContent>
