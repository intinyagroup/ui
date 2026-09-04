<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Plus, X } from 'lucide-svelte';
	import { cn } from '../../utils.js';

	let {
		items,
		position = 'bottom-right',
		label = 'Actions',
		class: className
	}: {
		items: {
			label: string;
			icon?: Snippet;
			action: () => void;
		}[];
		position?: 'bottom-right' | 'bottom-left';
		/** Accessible name for the speed-dial group. */
		label?: string;
		class?: string;
	} = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);
	const SIDE = 56; // FAB diameter (h-14)
	const GAP = 12; // vertical spacing between items

	// Items stack upward from just above the main FAB (which fills the
	// 56x56 root): item i's bottom edge sits (i+1) * (SIDE + GAP) above
	// the root's bottom.
	function itemBottom(i: number): string {
		return `${(i + 1) * (SIDE + GAP)}px`;
	}

	function handleItemAction(action: () => void) {
		open = false;
		action();
	}

	function onPointerDown(e: PointerEvent) {
		if (open && rootEl && !rootEl.contains(e.target as Node)) {
			open = false;
		}
	}
</script>

<svelte:window
	onpointerdown={onPointerDown}
	onkeydown={(e) => {
		if (e.key === 'Escape' && open) open = false;
	}}
/>

<div
	bind:this={rootEl}
	class={cn('relative z-40 h-14 w-14', className)}
	role="group"
	aria-label={label}
>
	{#if open}
		<!-- Items fan out upward, staggered -->
		<div class="absolute inset-0">
			{#each items as item, i (item.label)}
				<button
					type="button"
					class="absolute left-0 flex h-14 w-14 cursor-pointer touch-manipulation select-none items-center justify-center rounded-full bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] shadow-[var(--ui-shadow-lg)] transition-[transform,background-color] duration-[var(--ui-transition-fast)] active:scale-95"
					style="bottom: {itemBottom(i)}; opacity: 0; animation: intinya-fab-item-in 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards; animation-delay: {i * 40}ms;"
					onclick={() => handleItemAction(item.action)}
					aria-label={item.label}
				>
					<span class="flex items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
						{@render item.icon?.()}
					</span>
				</button>
				<span
					class="pointer-events-none absolute flex h-14 items-center whitespace-nowrap rounded-lg bg-[var(--ui-background)] px-3 text-[13px] font-medium text-[var(--ui-foreground)] shadow-[var(--ui-shadow-md)]"
					style="bottom: {itemBottom(i)}; {position === 'bottom-right' ? 'right: 68px' : 'left: 68px'}; opacity: 0; animation: intinya-fab-label-in 200ms ease-out forwards; animation-delay: {i * 40 + 60}ms;"
					aria-hidden="true"
				>
					{item.label}
				</span>
			{/each}
		</div>
	{/if}

	<!-- Main FAB toggle -->
	<button
		type="button"
		class="absolute left-0 top-0 flex h-14 w-14 cursor-pointer touch-manipulation select-none items-center justify-center rounded-full bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-[var(--ui-shadow-lg)] transition-[transform,background-color] duration-[var(--ui-transition-fast)] active:scale-95"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-haspopup="menu"
		aria-label={open ? 'Close actions' : label}
	>
		<span
			class="flex items-center justify-center transition-transform duration-[var(--ui-transition-base)] [&_svg]:h-6 [&_svg]:w-6"
			style={open ? 'transform: rotate(135deg)' : ''}
		>
			{#if open}
				<X />
			{:else}
				<Plus />
			{/if}
		</span>
	</button>
</div>

<style>
	@keyframes intinya-fab-item-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes intinya-fab-label-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
