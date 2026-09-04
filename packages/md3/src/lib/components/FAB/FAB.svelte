<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const fabVariants = tv({
		base: 'inline-flex items-center justify-center font-medium transition-all duration-[var(--ui-transition-base)] ease-[cubic-bezier(0.2,0,0,1)] cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-ring)]',
		variants: {
			variant: {
				elevated: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-[var(--ui-shadow-lg)] hover:shadow-[var(--ui-shadow-xl)]',
				surface: 'bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] shadow-[var(--ui-shadow-sm)] hover:shadow-[var(--ui-shadow-md)]',
				tertiary: 'bg-[var(--ui-accent)] text-[var(--ui-accent-foreground)] shadow-[var(--ui-shadow-md)] hover:shadow-[var(--ui-shadow-lg)]'
			},
			size: {
				small: 'w-12 h-12 rounded-2xl',
				large: 'h-14 px-6 gap-2 rounded-2xl'
			}
		},
		defaultVariants: {
			variant: 'elevated',
			size: 'large'
		}
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		variant = 'elevated',
		size = 'large',
		label,
		icon,
		onclick,
		class: className
	}: {
		variant?: 'elevated' | 'surface' | 'tertiary';
		size?: 'small' | 'large';
		label?: string;
		icon?: Snippet;
		onclick?: (e: MouseEvent) => void;
		class?: string;
	} = $props();

	let isPressed = $state(false);

	function handlePointerDown() {
		isPressed = true;
	}

	function handlePointerUp() {
		isPressed = false;
	}

	function handlePointerLeave() {
		isPressed = false;
	}
</script>

<button
	{onclick}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerLeave}
	class={cn(
		fabVariants({ variant, size }),
		'active:scale-[0.98]',
		isPressed && 'scale-[0.98]',
		!isPressed && 'hover:scale-[1.05]',
		className
	)}
>
	{#if icon}
		<span class="flex shrink-0 items-center justify-center [&_svg]:h-6 [&_svg]:w-6">
			{@render icon()}
		</span>
	{/if}
	{#if label && size === 'large'}
		<span class="text-sm font-medium tracking-wide">{label}</span>
	{/if}
</button>
