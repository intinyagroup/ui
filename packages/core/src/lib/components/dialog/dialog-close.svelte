<script lang="ts">
	import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkDialog.CloseTrigger> = $props();
</script>

<ArkDialog.CloseTrigger bind:ref data-slot="dialog-close" {...restProps}>
	{@render children?.()}
</ArkDialog.CloseTrigger>
