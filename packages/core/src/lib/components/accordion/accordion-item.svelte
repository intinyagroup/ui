<script lang="ts">
	import { Accordion as ArkAccordion } from "@ark-ui/svelte/accordion";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		value,
		children,
		...restProps
	}: ComponentProps<typeof ArkAccordion.Item> = $props();
</script>

<ArkAccordion.Item
	bind:ref
	{value}
	data-slot="accordion-item"
	class={cn("border-b border-[var(--ui-border)] last:border-b-0", className)}
	{...restProps}
>
	{@render children?.()}
</ArkAccordion.Item>
