<script lang="ts">
	import { Popover as ArkPopover } from "@ark-ui/svelte/popover";
	import type { ComponentProps } from "svelte";

	let { open = $bindable(false), children, ...restProps }: ComponentProps<typeof ArkPopover.Root> = $props();
</script>

<ArkPopover.Root
	bind:open
	onOpenChange={(e) => {
		open = e.open;
		restProps.onOpenChange?.(e);
	}}
	{...restProps}
>
	{@render children?.()}
</ArkPopover.Root>
