<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	const numberInputVariants = tv({
		base: 'inline-flex items-center rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] text-sm transition-colors focus-within:border-[var(--ui-ring)] focus-within:ring-3 focus-within:ring-[var(--ui-ring)]/50 disabled:cursor-not-allowed disabled:opacity-50',
		variants: {
			size: {
				sm: 'h-8 text-xs',
				default: 'h-10 text-sm',
				lg: 'h-12 text-base',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	});

	const buttonVariants = tv({
		base: 'flex shrink-0 items-center justify-center bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] transition-colors hover:bg-[var(--ui-secondary)]/80 disabled:pointer-events-none disabled:opacity-50 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]/50',
		variants: {
			size: {
				sm: 'h-8 w-7',
				default: 'h-10 w-9',
				lg: 'h-12 w-11',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	});

	export type NumberInputSize = VariantProps<typeof numberInputVariants>['size'];

	export type NumberInputProps = WithElementRef<Omit<HTMLInputAttributes, 'type' | 'size' | 'value'> & {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		size?: NumberInputSize;
		unit?: string;
		disabled?: boolean;
	}>;
</script>

<script lang="ts">
	import { Minus, Plus } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		value = $bindable(0),
		min = -Infinity,
		max = Infinity,
		step = 1,
		size = 'default',
		unit,
		disabled = false,
		class: className,
		placeholder,
		onchange,
		...restProps
	}: NumberInputProps = $props();

	const inputId = $derived(restProps.id ?? `number-input-${Math.random().toString(36).slice(2, 9)}`);

	function clamp(v: number): number {
		if (min !== -Infinity && v < min) return min;
		if (max !== Infinity && v > max) return max;
		return v;
	}

	function decrement() {
		if (disabled) return;
		const next = clamp(value - step);
		if (next !== value) {
			value = next;
			onchange?.({ value } as Event & { value: number });
		}
	}

	function increment() {
		if (disabled) return;
		const next = clamp(value + step);
		if (next !== value) {
			value = next;
			onchange?.({ value } as Event & { value: number });
		}
	}

	function handleInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const raw = input.value;

		if (raw === '' || raw === '-') {
			// Allow typing — don't clamp yet
			return;
		}

		const parsed = parseFloat(raw);
		if (!Number.isNaN(parsed)) {
			value = clamp(parsed);
		}
	}

	function handleBlur() {
		// On blur, ensure value is clamped
		value = clamp(value);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (disabled) return;

		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				increment();
				break;
			case 'ArrowDown':
				e.preventDefault();
				decrement();
				break;
			case 'Home':
				if (min !== -Infinity) {
					e.preventDefault();
					value = min;
				}
				break;
			case 'End':
				if (max !== Infinity) {
					e.preventDefault();
					value = max;
				}
				break;
		}
	}

	const isAtMin = $derived(min !== -Infinity && value <= min);
	const isAtMax = $derived(max !== Infinity && value >= max);
</script>

<div
	class={cn(numberInputVariants({ size }), className)}
	data-slot="number-input"
	role="group"
	aria-label="Number input"
>
	<button
		type="button"
		class={cn(buttonVariants({ size }), 'rounded-l-lg border-r-0')}
		onclick={decrement}
		disabled={disabled || isAtMin}
		aria-label="Decrease value"
		tabindex={-1}
	>
		<Minus class={cn(size === 'sm' ? 'size-3' : size === 'lg' ? 'size-4' : 'size-3.5')} />
	</button>

	<div class="relative flex-1 flex items-center justify-center">
		<input
			type="number"
			bind:this={ref}
			id={inputId}
			{max}
			{step}
			{disabled}
			{placeholder}
			class="h-full w-full border-0 bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]:appearance-none"
			style="min-width: 0;"
			oninput={handleInput}
			onblur={handleBlur}
			onkeydown={handleKeydown}
			aria-valuenow={value}
			aria-valuemin={min !== -Infinity ? min : undefined}
			aria-valuemax={max !== Infinity ? max : undefined}
			{...restProps}
			bind:value
		/>
		{#if unit}
			<span class="pointer-events-none absolute right-1.5 text-[var(--ui-muted-foreground)] text-xs select-none" aria-hidden="true">
				{unit}
			</span>
		{/if}
	</div>

	<button
		type="button"
		class={cn(buttonVariants({ size }), 'rounded-r-lg border-l-0')}
		onclick={increment}
		disabled={disabled || isAtMax}
		aria-label="Increase value"
		tabindex={-1}
	>
		<Plus class={cn(size === 'sm' ? 'size-3' : size === 'lg' ? 'size-4' : 'size-3.5')} />
	</button>
</div>
