<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		variant = 'assist',
		selected = false,
		icon,
		trailingIcon,
		onclick,
		class: className,
		children,
		...restProps
	}: {
		variant?: 'assist' | 'filter' | 'input' | 'suggestion';
		selected?: boolean;
		icon?: Snippet;
		trailingIcon?: Snippet;
		onclick?: (e: MouseEvent) => void;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<button
	class={cn(
		// Base
		'group relative inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors duration-200',
		// Assist
		variant === 'assist' &&
			'bg-[var(--ui-surface-container-high)] border-[var(--ui-outline)] text-[var(--ui-on-surface)]',
		// Filter unselected
		variant === 'filter' &&
			!selected &&
			'bg-[var(--ui-surface-container-low)] border-[var(--ui-outline)] text-[var(--ui-on-surface-variant)]',
		// Filter selected
		variant === 'filter' &&
			selected &&
			'bg-[var(--ui-secondary-container)] border-transparent text-[var(--ui-on-secondary-container)]',
		// Input
		variant === 'input' &&
			'bg-transparent border-[var(--ui-outline)] text-[var(--ui-on-surface)]',
		// Suggestion
		variant === 'suggestion' &&
			'bg-[var(--ui-surface-container-high)] border-transparent text-[var(--ui-on-surface-variant)]',
		className
	)}
	{onclick}
	{...restProps}
>
	<!-- MD3 state layer -->
	<span
		class="pointer-events-none absolute inset-0 rounded-lg bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-[0.08]"
		aria-hidden="true"
	></span>

	<!-- Leading icon / check -->
	{#if icon}
		<span class="relative z-10 flex shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
			{@render icon()}
		</span>
	{/if}

	<!-- Label -->
	<span class="relative z-10 whitespace-nowrap">
		{@render children?.()}
	</span>

	<!-- Trailing icon -->
	{#if trailingIcon}
		<span class="relative z-10 flex shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
			{@render trailingIcon()}
		</span>
	{/if}
</button>
