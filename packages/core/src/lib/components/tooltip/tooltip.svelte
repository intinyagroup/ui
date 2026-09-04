<script lang="ts">
	import { Tooltip as ArkTooltip } from "@ark-ui/svelte/tooltip";
	import type { ComponentProps } from "svelte";

	let { open = $bindable(false), children, ...restProps }: ComponentProps<typeof ArkTooltip.Root> = $props();
</script>

<ArkTooltip.Root
	bind:open
	onOpenChange={(e) => {
		open = e.open;
		restProps.onOpenChange?.(e);
	}}
	{...restProps}
>
	{@render children?.()}
</ArkTooltip.Root>
