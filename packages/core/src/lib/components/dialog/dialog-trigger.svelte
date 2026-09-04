<script lang="ts">
	import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null), children, ...restProps }: ComponentProps<typeof ArkDialog.Trigger> = $props();
</script>

<ArkDialog.Trigger bind:ref data-slot="dialog-trigger" {...restProps}>
	{@render children?.()}
</ArkDialog.Trigger>
