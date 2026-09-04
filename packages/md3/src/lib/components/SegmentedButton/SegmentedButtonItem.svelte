<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';

	let {
		value: itemValue,
		icon,
		label,
		class: className
	}: {
		value: string;
		icon?: Snippet;
		label: string;
		class?: string;
	} = $props();

	const ctx = getContext<{
		isSelected: (value: string) => boolean;
		toggle: (value: string) => void;
	}>('segmented-button');

	let selected = $derived(ctx.isSelected(itemValue));

	function handleClick() {
		ctx.toggle(itemValue);
	}

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
	type="button"
	role="radio"
	aria-checked={selected}
	onclick={handleClick}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerLeave}
	class={cn(
		// Base
		'group relative inline-flex h-full flex-1 cursor-pointer select-none items-center justify-center gap-1.5',
		'transition-colors duration-200',
		// State layer
		'hover:bg-[var(--ui-on-surface)]/[0.08]',
		// Focus
		'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ui-outline)]',
		// Pressed state
		isPressed && 'scale-[0.98]',
		// Selected
		selected && 'bg-[var(--ui-secondary-container)]',
		selected && 'text-[var(--ui-on-secondary-container)]',
		// Unselected
		!selected && 'text-[var(--ui-on-surface)]',
		className
	)}
>
	<!-- Active state layer -->
	{#if selected}
		<span
			class="pointer-events-none absolute inset-0 rounded-full bg-[var(--ui-on-secondary-container)] opacity-0 transition-opacity duration-200 group-hover:opacity-[0.08]"
			aria-hidden="true"
		></span>
	{/if}

	<!-- Check icon when selected -->
	{#if selected}
		<span class="relative z-10 flex shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
				<path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17l10.59-10.59L21 7z" />
			</svg>
		</span>
	{/if}

	<!-- Custom icon -->
	{#if icon && !selected}
		<span class="relative z-10 flex shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
			{@render icon()}
		</span>
	{/if}

	<!-- Label -->
	<span class="relative z-10 whitespace-nowrap text-sm font-medium">
		{label}
	</span>
</button>
