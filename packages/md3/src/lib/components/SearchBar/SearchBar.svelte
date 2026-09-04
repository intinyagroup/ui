<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		value = $bindable(''),
		placeholder = 'Search',
		leadingIcon,
		trailingIcon,
		class: className
	}: {
		value?: string;
		placeholder?: string;
		leadingIcon?: Snippet;
		trailingIcon?: Snippet;
		class?: string;
	} = $props();

	let focused = $state(false);
	let inputRef = $state<HTMLInputElement | null>(null);

	function handleFocus() {
		focused = true;
	}

	function handleBlur() {
		focused = false;
	}

	function clear() {
		value = '';
		inputRef?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (value) {
				value = '';
			} else {
				inputRef?.blur();
			}
		}
	}
</script>

<div
	class={cn(
		// Base container
		'group relative flex h-14 items-center gap-2 rounded-full border px-4 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
		// Outlined variant
		'bg-[var(--ui-surface)] border-[var(--ui-outline)] text-[var(--ui-on-surface)]',
		// Focused state
		focused && 'border-[var(--ui-primary)] shadow-[0_0_0_1px_var(--ui-primary)]',
		// Hover state
		'hover:border-[var(--ui-on-surface)]',
		className
	)}
>
	<!-- MD3 state layer -->
	<span
		class="pointer-events-none absolute inset-0 rounded-full bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-[0.08]"
		aria-hidden="true"
	></span>

	<!-- Leading icon -->
	{#if leadingIcon}
		<span class="relative z-10 flex shrink-0 items-center justify-center text-[var(--ui-on-surface-variant)] [&_svg]:h-6 [&_svg]:w-6">
			{@render leadingIcon()}
		</span>
	{/if}

	<!-- Input -->
	<input
		bind:this={inputRef}
		bind:value
		type="text"
		{placeholder}
		onfocus={handleFocus}
		onblur={handleBlur}
		onkeydown={handleKeydown}
		class="relative z-10 min-w-0 flex-1 bg-transparent text-base text-[var(--ui-on-surface)] placeholder:text-[var(--ui-on-surface-variant)] outline-none"
	/>

	<!-- Clear button -->
	{#if value}
		<button
			type="button"
			onclick={clear}
			class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ui-on-surface-variant)] transition-colors hover:bg-[var(--ui-surface-container-high)]"
			aria-label="Clear search"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="m15 9-6 6" />
				<path d="m9 9 6 6" />
			</svg>
		</button>
	{/if}

	<!-- Trailing icon -->
	{#if trailingIcon}
		<span class="relative z-10 flex shrink-0 items-center justify-center text-[var(--ui-on-surface-variant)] [&_svg]:h-6 [&_svg]:w-6">
			{@render trailingIcon()}
		</span>
	{/if}
</div>
