<script lang="ts">
	import { Tooltip as ArkTooltip } from "@ark-ui/svelte/tooltip";
	import { Portal } from "@ark-ui/svelte/portal";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkTooltip.Content> = $props();
</script>

<Portal>
	<ArkTooltip.Positioner class="z-50">
		<ArkTooltip.Content
			bind:ref
			data-slot="tooltip-content"
			class={cn(
				"bg-primary text-primary-foreground z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
				className
			)}
			{...restProps}
		>
			{@render children?.()}
		</ArkTooltip.Content>
	</ArkTooltip.Positioner>
</Portal>
