<script lang="ts">
	import { Tooltip as ArkTooltip } from "@ark-ui/svelte/tooltip";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkTooltip.Trigger> = $props();
</script>

<ArkTooltip.Trigger bind:ref data-slot="tooltip-trigger" {...restProps}>
	{@render children?.()}
</ArkTooltip.Trigger>
