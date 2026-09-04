<script lang="ts">
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';
	import { cn } from '../../utils.js';

	let {
		open,
		side = 'left',
		overlay = true,
		title,
		onclose,
		class: className,
		children
	}: {
		open: boolean;
		/** Which edge the drawer slides in from. */
		side?: 'left' | 'right';
		/** Dim the page behind the drawer (tap-to-close). */
		overlay?: boolean;
		/** Optional header title, shown next to the close button. */
		title?: string;
		onclose?: () => void;
		class?: string;
		children: Snippet;
	} = $props();

	let panel = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!open) return;
		const el = panel;
		if (!el) return;
		// Trap Tab focus inside the panel while it is open, starting at the
		// close button. Focus is restored to the previous element on close.
		const focusables = el.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		const onKeydown = (e: KeyboardEvent) => {
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
		// Wait for the drawer to mount, then move focus in.
		tick().then(() => first?.focus());
		return () => el.removeEventListener('keydown', onKeydown);
	});

	function close() {
		if (open) {
			open = false;
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && close()} />

{#if open}
	<div
		class="fixed inset-0 z-50"
		role="presentation"
		style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right)"
	>
		{#if overlay}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="absolute inset-0 bg-black/50"
				style="animation: intinya-slide-menu-fade 200ms ease-out"
				onclick={close}
				role="presentation"
				aria-hidden="true"
			></div>
		{/if}
		<div
			bind:this={panel}
			role="presentation"
			class={cn(
				'absolute top-0 flex h-full max-w-[85vw] flex-col bg-[var(--ui-background)] shadow-[var(--ui-shadow-xl)]',
				side === 'left' ? 'left-0' : 'right-0',
				className
			)}
			style="animation: intinya-slide-menu-{side} 300ms cubic-bezier(0.32, 0.72, 0, 1)"
		>
			<header
				class="flex h-14 shrink-0 items-center gap-2 px-3"
				style="padding-top: env(safe-area-inset-top)"
			>
				<button
					type="button"
					class="flex h-10 w-10 cursor-pointer touch-manipulation select-none items-center justify-center rounded-full text-[var(--ui-muted-foreground)] transition-[background-color,transform] duration-[var(--ui-transition-fast)] active:scale-90 active:bg-[var(--ui-accent)]"
					aria-label="Close menu"
					onclick={close}
				>
					<X class="h-5 w-5" aria-hidden="true" />
				</button>
				{#if title}
					<span class="truncate text-base font-semibold text-[var(--ui-foreground)]">
						{title}
					</span>
				{/if}
			</header>
			<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">{@render children()}</div>
		</div>
	</div>
{/if}

<style>
	@keyframes intinya-slide-menu-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes intinya-slide-menu-left {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}
	@keyframes intinya-slide-menu-right {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
