<script lang="ts">
	import { Select as ArkSelect } from "@ark-ui/svelte/select";
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		value,
		children,
		...restProps
	}: ComponentProps<typeof ArkSelect.Item> = $props();
</script>

<ArkSelect.Item
	bind:ref
	{value}
	data-slot="select-item"
	class={cn(
		"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none data-[highlighted]:bg-[var(--ui-accent)] data-[highlighted]:text-[var(--ui-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		className
	)}
	{...restProps}
>
	<ArkSelect.ItemText>
		{@render children?.()}
	</ArkSelect.ItemText>
	<ArkSelect.ItemIndicator class="absolute right-2 flex size-3.5 items-center justify-center">
		<CheckIcon class="size-4" />
	</ArkSelect.ItemIndicator>
</ArkSelect.Item>
