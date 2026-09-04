<script lang="ts">
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';

	let {
		open,
		title,
		cancelLabel = 'Cancel',
		showCancel = true,
		onclose,
		class: className,
		children
	}: {
		open: boolean;
		title?: string;
		cancelLabel?: string;
		showCancel?: boolean;
		onclose?: () => void;
		class?: string;
		children: Snippet;
	} = $props();

	let panel = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!open) return;
		const el = panel;
		if (!el) return;
		const focusables = el.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				open = false;
				onclose?.();
				return;
			}
			if (e.key === 'Tab') {
				if (!focusables.length) return;
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		el.addEventListener('keydown', onKeydown);
		tick().then(() => first?.focus());
		return () => el.removeEventListener('keydown', onKeydown);
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && open && ((open = false), onclose?.())} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex flex-col justify-end"
		role="presentation"
		style="padding-bottom: env(safe-area-inset-bottom)"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-black/50"
			style="animation: intinya-action-sheet-fade 200ms ease-out"
			onclick={() => {
				open = false;
				onclose?.();
			}}
			role="presentation"
			aria-hidden="true"
		></div>
		<div
			bind:this={panel}
			role="presentation"
			onkeydown={(e) => e.stopPropagation()}
			class="pointer-events-auto relative z-10 mx-2 mb-2 flex flex-col gap-2 rounded-2xl"
			style="animation: intinya-action-sheet-slide 300ms cubic-bezier(0.32, 0.72, 0, 1)"
		>
			<div class="overflow-hidden rounded-2xl bg-[var(--ui-background)] shadow-[var(--ui-shadow-lg)]">
				{#if title}
					<div class="border-b border-[var(--ui-border)] px-4 pb-3 pt-4 text-center">
						<span class="text-sm font-semibold text-[var(--ui-foreground)]">{title}</span>
					</div>
				{/if}
				<div class="flex flex-col" role="presentation" aria-label={title ?? 'Actions'}>
					{@render children()}
				</div>
			</div>
			{#if showCancel}
				<button
					type="button"
					class="h-12 cursor-pointer touch-manipulation select-none rounded-2xl bg-[var(--ui-background)] text-center text-base font-semibold text-[var(--ui-foreground)] shadow-[var(--ui-shadow-md)] transition-[opacity,transform] duration-[var(--ui-transition-fast)] active:scale-[0.98] active:opacity-90"
					onclick={() => {
						open = false;
						onclose?.();
					}}
				>
					{cancelLabel}
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes intinya-action-sheet-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes intinya-action-sheet-slide {
		from {
			transform: translateY(120%);
			opacity: 0.6;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
