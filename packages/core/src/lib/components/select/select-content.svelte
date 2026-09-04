<script lang="ts">
	import { Select as ArkSelect } from "@ark-ui/svelte/select";
	import { Portal } from "@ark-ui/svelte/portal";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkSelect.Content> = $props();
</script>

<Portal>
	<ArkSelect.Positioner class="z-50">
		<ArkSelect.Content
			bind:ref
			data-slot="select-content"
			class={cn(
				"bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-[var(--ui-border)] p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				className
			)}
			{...restProps}
		>
			{@render children?.()}
		</ArkSelect.Content>
	</ArkSelect.Positioner>
</Portal>
