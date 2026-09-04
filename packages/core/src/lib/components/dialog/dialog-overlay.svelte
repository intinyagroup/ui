<script lang="ts">
	import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof ArkDialog.Backdrop> = $props();
</script>

<ArkDialog.Backdrop
	bind:ref
	data-slot="dialog-overlay"
	class={cn(
		"fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
		className
	)}
	{...restProps}
/>
