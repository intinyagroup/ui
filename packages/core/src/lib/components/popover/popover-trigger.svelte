<script lang="ts">
	import { Popover as ArkPopover } from "@ark-ui/svelte/popover";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkPopover.Trigger> = $props();
</script>

<ArkPopover.Trigger bind:ref data-slot="popover-trigger" {...restProps}>
	{@render children?.()}
</ArkPopover.Trigger>
