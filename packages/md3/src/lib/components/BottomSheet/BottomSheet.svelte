<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { cn } from '$lib/utils';

	interface Props {
		/** Whether the bottom sheet is visible */
		open?: boolean;
		/** Display variant */
		variant?: 'standard' | 'expanding';
		/** Optional title displayed above content */
		title?: string;
		/** Panel content */
		children?: Snippet;
		/** Additional CSS classes for the panel */
		class?: string;
	}

	let {
		open = $bindable(false),
		variant = 'standard',
		title = undefined,
		children = undefined,
		class: className = undefined
	}: Props = $props();

	function handleClose() {
		open = false;
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}

	const maxHeight = $derived(variant === 'expanding' ? '100dvh' : '80dvh');
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
		transition:fade={{ duration: 200 }}
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
	>
		<div
			class={cn(
				'w-full bg-[var(--ui-surface-container-low)] rounded-t-3xl shadow-lg',
				'flex flex-col overflow-hidden',
				className
			)}
			style="max-height: {maxHeight}"
			transition:slide={{ duration: 300, easing: cubicOut, axis: 'y' }}
		>
			<!-- Drag Handle -->
			<div class="flex justify-center pt-3 pb-1">
				<div
					class="w-10 h-1 rounded-full bg-[var(--ui-on-surface)]/20"
					role="presentation"
				></div>
			</div>

			<!-- Title -->
			{#if title}
				<div class="px-6 pb-4">
					<h2
						class="text-lg font-medium text-[var(--ui-on-surface)]"
					>
						{title}
					</h2>
				</div>
			{/if}

			<!-- Content -->
			<div class="flex-1 overflow-y-auto px-6 pb-6">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}
