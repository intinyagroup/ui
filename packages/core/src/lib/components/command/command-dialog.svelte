<script lang="ts">
	import * as Dialog from "$lib/components/dialog/index.js";
	import { cn } from "$lib/utils.js";
	import Command from "./command.svelte";
	import type { Snippet, ComponentProps } from "svelte";

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command Palette",
		description = "Search for a command to run...",
		showCloseButton = false,
		children,
		class: className,
		shortcutKey = "k",
		...restProps
	}: {
		open?: boolean;
		ref?: HTMLElement | null;
		value?: string;
		title?: string;
		description?: string;
		showCloseButton?: boolean;
		children?: Snippet;
		class?: string;
		shortcutKey?: string;
		[key: string]: any;
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

<Dialog.Root bind:open>
	<Dialog.Header class="sr-only">
		<Dialog.Title>{title}</Dialog.Title>
		<Dialog.Description>{description}</Dialog.Description>
	</Dialog.Header>
	<Dialog.Content
		class={cn("rounded-xl! top-1/3 translate-y-0 overflow-hidden p-0", className)}
		{showCloseButton}
	>
		<Command {...restProps} bind:value bind:ref {children} />
	</Dialog.Content>
</Dialog.Root>
