<script lang="ts">
	import { Accordion as ArkAccordion } from "@ark-ui/svelte/accordion";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkAccordion.Root> = $props();
</script>

<ArkAccordion.Root
	bind:ref
	data-slot="accordion"
	class={cn("w-full divide-y divide-[var(--ui-border)]", className)}
	{...restProps}
>
	{@render children?.()}
</ArkAccordion.Root>
