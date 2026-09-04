<script lang="ts">
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	type SliderProps = WithoutChildrenOrChild<SliderPrimitive.RootProps> & {
		/** Show numeric value labels above each thumb */
		showLabels?: boolean;
		/** Position of value labels relative to the thumb */
		labelPosition?: "top" | "bottom" | "left" | "right";
		/** Custom label formatter. Receives current value and thumb index. */
		labelFormatter?: (value: number, index: number) => string;
	};

	let {
		ref = $bindable(null),
		value = $bindable([0]),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		orientation = "horizontal",
		showLabels = false,
		labelPosition = "top",
		labelFormatter,
		class: className,
		...restProps
	}: SliderProps = $props();

	function defaultLabel(value: number): string {
		return String(Math.round(value));
	}

	function getLabel(val: number, index: number): string {
		if (labelFormatter) return labelFormatter(val, index);
		return defaultLabel(val);
	}

</script>

<!--
Discriminated Unions + Destructuring (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="slider"
	data-disabled={disabled || undefined}
	{min}
	{max}
	{step}
	{disabled}
	{orientation}
	class={cn(
		"relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
		orientation === "vertical" && "min-h-40 h-full w-auto flex-col",
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbItems })}
		<!-- Track -->
		<span
			data-slot="slider-track"
			data-orientation={orientation}
			class={cn(
				"relative grow overflow-hidden rounded-full bg-muted",
				orientation === "horizontal" && "h-1.5 w-full",
				orientation === "vertical" && "h-full w-1.5"
			)}
		>
			<!-- Range fill -->
			<SliderPrimitive.Range
				data-slot="slider-range"
				class={cn(
					"absolute bg-primary select-none",
					orientation === "horizontal" && "h-full",
					orientation === "vertical" && "w-full"
				)}
			/>
		</span>

		<!-- Thumbs -->
		{#each thumbItems as thumb (thumb.index)}
			<div
				class="relative flex shrink-0 flex-col items-center"
				style:align-self={orientation === "vertical" ? "auto" : undefined}
			>
				{#if showLabels && labelPosition === "top"}
					<span
						data-slot="slider-label"
						class={cn(
							"pointer-events-none mb-1.5 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background tabular-nums leading-none whitespace-nowrap",
							orientation === "vertical" && "absolute top-0 right-full mr-2"
						)}
					>
						{getLabel(thumb.value, thumb.index)}
					</span>
				{/if}

				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					index={thumb.index}
					class="block size-4 shrink-0 rounded-full border border-primary/50 bg-white ring-offset-background transition-[color,box-shadow] hover:ring-2 hover:ring-ring/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:ring-2 disabled:pointer-events-none disabled:opacity-50 dark:border-primary dark:bg-primary"
				/>

				{#if showLabels && labelPosition === "bottom"}
					<span
						data-slot="slider-label"
						class={cn(
							"pointer-events-none mt-1.5 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background tabular-nums leading-none whitespace-nowrap",
							orientation === "vertical" && "absolute bottom-0 right-full mr-2"
						)}
					>
						{getLabel(thumb.value, thumb.index)}
					</span>
				{/if}
			</div>
		{/each}
	{/snippet}
</SliderPrimitive.Root>
