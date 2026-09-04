<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled = false,
		required = false,
		class: className,
		...restProps
	}: CheckboxPrimitive.RootProps = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	bind:checked
	bind:indeterminate
	data-slot="checkbox"
	{disabled}
	{required}
	class={cn(
		"peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary size-4 shrink-0 rounded-[4px] border shadow-sm transition-colors outline-none",
		"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
		"disabled:cursor-not-allowed disabled:opacity-50",
		"aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked: isChecked, indeterminate: isIndeterminate })}
		<div
			data-slot="checkbox-indicator"
			class="flex items-center justify-center text-current"
		>
			{#if isIndeterminate}
				<MinusIcon class="size-3.5" />
			{:else if isChecked}
				<CheckIcon class="size-3.5" />
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
