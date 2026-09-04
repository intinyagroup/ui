<script lang="ts">
	import { RadioGroup as ArkRadioGroup } from "@ark-ui/svelte/radio-group";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		value,
		children,
		...restProps
	}: ComponentProps<typeof ArkRadioGroup.Item> = $props();
</script>

<ArkRadioGroup.Item
	bind:ref
	{value}
	data-slot="radio-group-item"
	class={cn("inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50", className)}
	{...restProps}
>
	<ArkRadioGroup.ItemControl
		class="size-4 rounded-full border border-[var(--ui-border)] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] data-[state=checked]:border-[var(--ui-primary)] data-[state=checked]:bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]"
	>
		<div class="size-2 rounded-full bg-current opacity-0 transition-opacity data-[state=checked]:opacity-100"></div>
	</ArkRadioGroup.ItemControl>
	<ArkRadioGroup.ItemHiddenInput />
	{#if children}
		<ArkRadioGroup.ItemText class="text-sm font-medium text-[var(--ui-foreground)]">
			{@render children()}
		</ArkRadioGroup.ItemText>
	{/if}
</ArkRadioGroup.Item>
