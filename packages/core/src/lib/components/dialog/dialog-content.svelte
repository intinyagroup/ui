<script lang="ts">
	import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
	import { Portal } from "@ark-ui/svelte/portal";
	import XIcon from '@lucide/svelte/icons/x';
	import { Button } from "$lib/components/button/index.js";
	import { cn } from "$lib/utils.js";
	import DialogOverlay from "./dialog-overlay.svelte";
	import type { ComponentProps, Snippet } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		showCloseButton = true,
		...restProps
	}: ComponentProps<typeof ArkDialog.Content> & {
		children?: Snippet;
		showCloseButton?: boolean;
	} = $props();
</script>

<Portal>
	<DialogOverlay />
	<ArkDialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<ArkDialog.Content
			bind:ref
			data-slot="dialog-content"
			class={cn(
				"relative z-50 grid w-full max-w-lg gap-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-background)] p-6 shadow-lg duration-200 text-sm text-[var(--ui-foreground)] outline-none sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
				className
			)}
			{...restProps}
		>
			{@render children?.()}
			{#if showCloseButton}
				<ArkDialog.CloseTrigger class="absolute top-4 right-4" data-slot="dialog-close">
					<Button variant="ghost" size="icon-sm">
						<XIcon class="size-4" />
						<span class="sr-only">Close</span>
					</Button>
				</ArkDialog.CloseTrigger>
			{/if}
		</ArkDialog.Content>
	</ArkDialog.Positioner>
</Portal>
