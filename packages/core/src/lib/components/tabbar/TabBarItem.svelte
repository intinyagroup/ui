<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';
	import { getTabBar } from './context.js';

	const parent = getTabBar();
	let {
		value,
		label,
		icon,
		badge,
		onclick,
		active,
		class: className
	}: {
		value: string | number;
		label: string;
		icon?: Snippet;
		badge?: number;
		onclick?: (e: MouseEvent) => void;
		/** Override the parent TabBar's value comparison. */
		active?: boolean;
		class?: string;
	} = $props();

	const isActive = $derived(active ?? parent?.value === value);

	function handleClick(e: MouseEvent) {
		parent?.setValue(value);
		onclick?.(e);
	}
</script>

<button
	type="button"
	role="tab"
	onclick={handleClick}
	class={cn(
		'group relative flex min-h-11 min-w-0 flex-1 cursor-pointer select-none flex-col items-center justify-center gap-0.5',
		'px-2 pt-1.5 transition-[color,opacity,transform] duration-[var(--ui-transition-fast)]',
		isActive
			? 'text-[var(--ui-primary)]'
			: 'text-[var(--ui-muted-foreground)] active:text-[var(--ui-foreground)]',
		className
	)}
	aria-selected={isActive}
>
	<span class="relative flex items-center justify-center">
		{#if icon}
			<span class="flex [&_svg]:h-6 [&_svg]:w-6" aria-hidden="true">
				{@render icon()}
			</span>
		{/if}
		{#if badge !== undefined && badge > 0}
			<span
				class="absolute -right-2.5 -top-1 flex min-w-4 items-center justify-center rounded-full bg-[var(--ui-destructive)] px-1 text-[10px] font-semibold leading-4 text-white tabular-nums"
				>{badge > 99 ? '99+' : badge}</span
			>
		{/if}
	</span>
	<span class="max-w-full truncate text-[11px] font-medium leading-none">{label}</span>
</button>