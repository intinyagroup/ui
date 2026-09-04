<script lang="ts">
	import { Accordion as ArkAccordion } from "@ark-ui/svelte/accordion";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkAccordion.ItemTrigger> = $props();
</script>

<ArkAccordion.ItemTrigger
	bind:ref
	data-slot="accordion-trigger"
	class={cn(
		"flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-sm text-[var(--ui-foreground)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] [&[data-state=open]>svg]:rotate-180",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon class="size-4 shrink-0 transition-transform duration-200" />
</ArkAccordion.ItemTrigger>
