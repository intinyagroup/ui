<script lang="ts">
	import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		value,
		children,
		...restProps
	}: ComponentProps<typeof ArkMenu.RadioItem> = $props();
</script>

<ArkMenu.RadioItem
	bind:ref
	{value}
	data-slot="dropdown-menu-radio-item"
	class={cn(
		"relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors data-[highlighted]:bg-[var(--ui-accent)] data-[highlighted]:text-[var(--ui-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		className
	)}
	{...restProps}
>
	<ArkMenu.ItemIndicator class="absolute left-2 flex size-3.5 items-center justify-center">
		<CheckIcon class="size-4" />
	</ArkMenu.ItemIndicator>
	<ArkMenu.ItemText>
		{@render children?.()}
	</ArkMenu.ItemText>
</ArkMenu.RadioItem>
