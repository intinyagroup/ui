<script lang="ts">
	import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkDialog.Title> = $props();
</script>

<ArkDialog.Title
	bind:ref
	data-slot="dialog-title"
	class={cn("text-lg font-semibold leading-none tracking-tight text-[var(--ui-foreground)]", className)}
	{...restProps}
>
	{@render children?.()}
</ArkDialog.Title>
