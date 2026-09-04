<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import { Portal } from "@ark-ui/svelte/portal";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkMenu.Content> = $props();
</script>

<Portal>
	<ArkMenu.Positioner class="z-50">
		<ArkMenu.Content
			bind:ref
			data-slot="dropdown-menu-content"
			class={cn(
				"bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--ui-border)] p-1 shadow-md outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
				className
			)}
			{...restProps}
		>
			{@render children?.()}
		</ArkMenu.Content>
	</ArkMenu.Positioner>
</Portal>
