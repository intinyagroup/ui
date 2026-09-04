<script lang="ts">
	import { Checkbox as ArkCheckbox } from "@ark-ui/svelte/checkbox";
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		disabled = false,
		required = false,
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkCheckbox.Root> = $props();
</script>

<ArkCheckbox.Root
	bind:ref
	bind:checked
	{disabled}
	{required}
	class={cn("inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50", className)}
	{...restProps}
>
	<ArkCheckbox.Control
		data-slot="checkbox"
		class="peer border-[var(--ui-border)] data-[state=checked]:bg-[var(--ui-primary)] data-[state=checked]:border-[var(--ui-primary)] data-[state=checked]:text-[var(--ui-primary-foreground)] size-4 shrink-0 rounded-[4px] border shadow-sm transition-colors flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]"
	>
		<ArkCheckbox.Indicator>
			<CheckIcon class="size-3.5" />
		</ArkCheckbox.Indicator>
	</ArkCheckbox.Control>
	<ArkCheckbox.HiddenInput />
	{#if children}
		<ArkCheckbox.Label class="text-sm font-medium leading-none text-[var(--ui-foreground)]">
			{@render children()}
		</ArkCheckbox.Label>
	{/if}
</ArkCheckbox.Root>
