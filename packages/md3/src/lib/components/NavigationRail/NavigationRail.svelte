<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type NavigationItem = {
		label: string;
		icon: Snippet;
		active?: boolean;
	};

	let {
		items = [],
		fab,
		class: className
	}: {
		items?: NavigationItem[];
		fab?: Snippet;
		class?: string;
	} = $props();
</script>

<nav
	class={cn(
		'w-20 flex flex-col items-center py-4 gap-2',
		'bg-[var(--ui-surface-container-low)]',
		className
	)}
>
	{#if fab}
		<div class="mb-2">
			{@render fab()}
		</div>
	{/if}

	{#each items as item}
		<button
			class={cn(
				'flex flex-col items-center gap-1 p-2 rounded-2xl',
				'transition-colors duration-200',
				item.active
					? 'bg-[var(--ui-secondary-container)] text-[var(--ui-on-secondary-container)]'
					: 'text-[var(--ui-on-surface-variant)] hover:bg-[var(--ui-state-layer)]'
			)}
			aria-label={item.label}
			aria-current={item.active ? 'page' : undefined}
		>
			{@render item.icon()}
			<span class="text-xs">{item.label}</span>
		</button>
	{/each}
</nav>
