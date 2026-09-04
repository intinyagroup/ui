<script lang="ts">
	import * as Dialog from "$lib/components/dialog/index.js";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import Command from "./command.svelte";
	import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command Palette",
		description = "Search for a command to run...",
		showCloseButton = false,
		portalProps,
		children,
		class: className,
		shortcutKey = "k",
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: DialogPrimitive.PortalProps;
			children: Snippet;
			title?: string;
			description?: string;
			showCloseButton?: boolean;
			class?: string;
			shortcutKey?: string;
		} = $props();

	// ⌘K / Ctrl+K keyboard shortcut
	function handleKeydown(e: KeyboardEvent) {
		const isMod = e.metaKey || e.ctrlKey;
		if (isMod && e.key.toLowerCase() === shortcutKey) {
			e.preventDefault();
			open = !open;
		}
		if (e.key === "Escape" && open) {
			open = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Dialog.Root bind:open {...restProps}>
	<Dialog.Header class="sr-only">
		<Dialog.Title>{title}</Dialog.Title>
		<Dialog.Description>{description}</Dialog.Description>
	</Dialog.Header>
	<Dialog.Content
		class={cn("rounded-xl! top-1/3 translate-y-0 overflow-hidden p-0", className)}
		{showCloseButton}
		{portalProps}
	>
		<Command {...restProps} bind:value bind:ref {children} />
	</Dialog.Content>
</Dialog.Root>
