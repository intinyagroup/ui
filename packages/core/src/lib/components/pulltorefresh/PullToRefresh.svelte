<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';

	const THRESHOLD = 80;

	let {
		onRefresh,
		disabled = false,
		class: className,
		children
	}: {
		onRefresh: () => Promise<void>;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	} = $props();

	let containerEl = $state<HTMLElement | null>(null);
	let refreshing = $state(false);
	let pulling = $state(false);
	let pullDistance = $state(0);
	let startY = 0;
	let touchId = -1;
	let tracking = false;

	const maxPull = 140;

	function isAtTop(): boolean {
		const el = containerEl;
		if (!el) return true;
		return el.scrollTop <= 0;
	}

	// --- Touch (mobile): touch-action: pan-y lets the browser own normal
	// vertical scrolling; we take over with preventDefault only while the
	// pull gesture is engaged at the top, which cancels the native
	// scroll/overscroll before it starts.
	function onTouchStart(e: TouchEvent) {
		if (disabled || refreshing) return;
		if (!isAtTop()) return;
		const t = e.touches[0];
		if (!t) return;
		tracking = true;
		touchId = t.identifier;
		startY = t.clientY;
		pulling = false;
	}

	function onTouchMove(e: TouchEvent) {
		if (!tracking) return;
		const t = Array.from(e.touches).find((t) => t.identifier === touchId);
		if (!t) return;
		const dy = t.clientY - startY;
		if (dy <= 0) {
			// Dragging back up: release the pull, let native scroll resume.
			if (pullDistance > 0) {
				pullDistance = 0;
				pulling = false;
			}
			return;
		}
		if (!isAtTop()) {
			// User scrolled away mid-gesture; stop tracking.
			tracking = false;
			return;
		}
		e.preventDefault();
		// Resistance: 50% past the threshold, so it takes a deliberate push
		// to fully pull, and the gesture feels springy rather than rigid.
		const resisted = dy > THRESHOLD ? THRESHOLD + (dy - THRESHOLD) * 0.5 : dy;
		pullDistance = Math.min(resisted, maxPull);
		pulling = true;
	}

	function onTouchEnd() {
		if (!tracking) return;
		tracking = false;
		pulling = false;
		if (disabled || refreshing) return;
		if (pullDistance >= THRESHOLD) {
			void startRefresh();
		} else {
			pullDistance = 0;
		}
	}

	function onTouchCancel() {
		if (!tracking) return;
		tracking = false;
		pulling = false;
		pullDistance = 0;
	}

	// --- Pointer (mouse / pen): no native scroll to fight, so plain pointer
	// tracking works. Touch is handled by the touch handlers above.
	function onPointerDown(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (disabled || refreshing || e.button !== 0) return;
		if (!isAtTop()) return;
		tracking = true;
		startY = e.clientY;
		pulling = false;
	}

	function onPointerMove(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!tracking || disabled || refreshing) return;
		const dy = e.clientY - startY;
		if (dy <= 0) {
			if (pullDistance > 0) {
				pullDistance = 0;
				pulling = false;
			}
			return;
		}
		const resisted = dy > THRESHOLD ? THRESHOLD + (dy - THRESHOLD) * 0.5 : dy;
		pullDistance = Math.min(resisted, maxPull);
		pulling = true;
	}

	function onPointerUp(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!tracking) return;
		tracking = false;
		pulling = false;
		if (disabled || refreshing) return;
		if (pullDistance >= THRESHOLD) {
			void startRefresh();
		} else {
			pullDistance = 0;
		}
	}

	function onPointerCancel(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!tracking) return;
		tracking = false;
		pulling = false;
		pullDistance = 0;
	}

	async function startRefresh() {
		refreshing = true;
		pullDistance = THRESHOLD;
		try {
			await onRefresh();
		} finally {
			refreshing = false;
			pullDistance = 0;
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={containerEl}
	class={cn(
		'relative touch-pan-y select-none overflow-y-auto overscroll-y-contain',
		className
	)}
	ontouchstart={onTouchStart}
	ontouchmove={onTouchMove}
	ontouchend={onTouchEnd}
	ontouchcancel={onTouchCancel}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerCancel}
>
	{#if !disabled}
		<div
			class="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center overflow-hidden"
			style="height: {pulling || refreshing ? pullDistance : 0}px; transition: {pulling || refreshing ? 'none' : 'height 300ms cubic-bezier(0.32, 0.72, 0, 1)'}"
			aria-hidden="true"
		>
			<div
				class="flex h-14 items-center justify-center text-[var(--ui-muted-foreground)]"
				style="transform: translateY(calc({Math.max(pullDistance - 44, 0)}px))"
			>
				<span
					class="flex h-6 w-6 items-center justify-center"
					style={refreshing ? 'animation: intinya-ptr-spin 800ms linear infinite' : ''}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						class="h-5 w-5"
						style="transform: rotate({Math.min(pullDistance / THRESHOLD, 1) * 360}deg)"
					>
						<path d="M12 2v4" />
						<path d="m16.2 7.8 2.9-2.9" />
						<path d="M18 12h4" />
						<path d="m16.2 16.2 2.9 2.9" />
						<path d="M12 18v4" />
						<path d="m4.9 19.1 2.9-2.9" />
						<path d="M2 12h4" />
						<path d="m4.9 4.9 2.9 2.9" />
					</svg>
				</span>
			</div>
		</div>
	{/if}
	{@render children()}
</div>

<style>
	@keyframes intinya-ptr-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
