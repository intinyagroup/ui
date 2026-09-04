<script lang="ts">
	import { Popover as ArkPopover } from "@ark-ui/svelte/popover";
	import { Portal } from "@ark-ui/svelte/portal";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkPopover.Content> = $props();
</script>

<Portal>
	<ArkPopover.Positioner class="z-50">
		<ArkPopover.Content
			bind:ref
			data-slot="popover-content"
			class={cn(
				"bg-popover text-popover-foreground z-50 w-72 rounded-md border border-[var(--ui-border)] p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				className
			)}
			{...restProps}
		>
			{@render children?.()}
		</ArkPopover.Content>
	</ArkPopover.Positioner>
</Portal>
