<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const topAppBarVariants = tv({
		base: 'sticky top-0 z-40 bg-[var(--ui-surface-container)] relative',
		variants: {
			variant: {
				small: 'h-16 px-4 flex items-center',
				center: 'h-16 px-4 flex items-center',
				medium: '',
				large: ''
			}
		},
		defaultVariants: {
			variant: 'small'
		}
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		variant = 'small',
		title = '',
		navigationIcon,
		actions,
		class: className
	}: {
		variant?: 'center' | 'small' | 'medium' | 'large';
		title?: string;
		navigationIcon?: Snippet;
		actions?: Snippet;
		class?: string;
	} = $props();

	/* ── Scroll-driven collapse for medium / large ── */

	const COLLAPSED_HEIGHT = 64;

	const isCollapsible = $derived(variant === 'medium' || variant === 'large');

	const expandedHeight = $derived(
		variant === 'large' ? 192 : variant === 'medium' ? 128 : COLLAPSED_HEIGHT
	);

	const scrollThreshold = $derived(expandedHeight - COLLAPSED_HEIGHT);

	let rawScrollY = $state(0);

	const progress = $derived(
		isCollapsible ? Math.min(Math.max(rawScrollY / scrollThreshold, 0), 1) : 0
	);

	const currentHeight = $derived(
		isCollapsible ? Math.round(expandedHeight - scrollThreshold * progress) : COLLAPSED_HEIGHT
	);

	/* Title font-size: medium → 28 px, large → 32 px; collapsed → 16 px */
	const expandedFontSize = $derived(variant === 'large' ? 32 : 28);
	const titleFontSize = $derived(
		isCollapsible ? Math.round(expandedFontSize - (expandedFontSize - 16) * progress) : 16
	);

	$effect(() => {
		if (!isCollapsible) return;

		const onScroll = () => {
			rawScrollY = window.scrollY;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header
	class={cn(topAppBarVariants({ variant }), className)}
	style={isCollapsible
		? `height: ${currentHeight}px; will-change: height;`
		: undefined}
>
	{#if isCollapsible}
		<!--
			Collapsible bar (medium / large):
			Content sits at the bottom of the expanded area.
			As scrollY increases the header shrinks and content slides up naturally.
		-->
		<div class="absolute inset-x-0 bottom-0 flex items-center px-4 pb-3">
			{#if navigationIcon}
				<div
					class="shrink-0 w-12 h-12 flex items-center justify-center rounded-full -ml-2 text-[var(--ui-on-surface)] hover:bg-black/5 transition-colors duration-[var(--ui-transition-fast)]"
				>
					{@render navigationIcon()}
				</div>
			{/if}
			<span
				class="text-[var(--ui-on-surface)] font-medium truncate ml-2"
				style="font-size: {titleFontSize}px; line-height: 1.25;"
			>
				{title}
			</span>
			{#if actions}
				<div class="ml-auto shrink-0 flex items-center text-[var(--ui-on-surface)]">
					{@render actions()}
				</div>
			{/if}
		</div>
	{:else}
		<!--
			Non-collapsible bar (small / center):
			Flex row — nav icon (optional) | title | actions (optional).
			center variant centres the title with absolute positioning so
			nav icon and actions remain in-flow on either side.
		-->
		{#if navigationIcon}
			<div
				class="shrink-0 w-12 h-12 flex items-center justify-center rounded-full -ml-2 mr-1 text-[var(--ui-on-surface)] hover:bg-black/5 transition-colors duration-[var(--ui-transition-fast)]"
			>
				{@render navigationIcon()}
			</div>
		{/if}

		<span
			class={cn(
				'text-[var(--ui-on-surface)] font-medium truncate',
				variant === 'center' &&
					'absolute inset-0 flex items-center justify-center pointer-events-none px-16'
			)}
		>
			{title}
		</span>

		{#if actions}
			<div
				class={cn(
					'shrink-0 flex items-center text-[var(--ui-on-surface)]',
					variant === 'center' && 'relative z-10'
				)}
			>
				{@render actions()}
			</div>
		{/if}
	{/if}
</header>
