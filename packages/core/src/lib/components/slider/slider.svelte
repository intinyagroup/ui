<script lang="ts">
	import { Slider as ArkSlider } from "@ark-ui/svelte/slider";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		value = $bindable([0]),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		orientation = "horizontal",
		class: className,
		...restProps
	}: ComponentProps<typeof ArkSlider.Root> = $props();
</script>

<ArkSlider.Root
	bind:ref
	bind:value
	{min}
	{max}
	{step}
	{disabled}
	{orientation}
	data-slot="slider"
	class={cn(
		"relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
		orientation === "vertical" && "min-h-40 h-full w-auto flex-col",
		className
	)}
	{...restProps}
>
	<ArkSlider.Control class="relative flex w-full items-center">
		<ArkSlider.Track class="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--ui-muted)]">
			<ArkSlider.Range class="absolute h-full bg-[var(--ui-primary)]" />
		</ArkSlider.Track>
		<ArkSlider.Thumb index={0} class="block size-5 rounded-full border-2 border-[var(--ui-primary)] bg-[var(--ui-background)] shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
	</ArkSlider.Control>
	<ArkSlider.HiddenInput />
</ArkSlider.Root>
