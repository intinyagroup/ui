<script lang="ts">
	import { RadioGroup as ArkRadioGroup } from "@ark-ui/svelte/radio-group";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		children,
		...restProps
	}: ComponentProps<typeof ArkRadioGroup.Root> = $props();
</script>

<ArkRadioGroup.Root
	bind:ref
	bind:value
	data-slot="radio-group"
	class={cn("grid gap-2 w-full", className)}
	{...restProps}
>
	{@render children?.()}
</ArkRadioGroup.Root>
