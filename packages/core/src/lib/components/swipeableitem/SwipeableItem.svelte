<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';

	let {
		children,
		actions,
		threshold = 80,
		direction = 'left',
		class: className
	}: {
		children: Snippet;
		/** Buttons revealed behind the content (e.g. delete, archive). */
		actions: Snippet;
		/** Distance in px that must be swiped before the item stays open. */
		threshold?: number;
		/** Swipe direction that reveals the actions: 'left' reveals right-side actions, 'right' reveals left-side. */
		direction?: 'left' | 'right';
		class?: string;
	} = $props();

	// Read fresh inside the gesture handlers so a direction change applies.
	function revealSign(): number {
		return direction === 'left' ? -1 : 1;
	}

	let rootEl = $state<HTMLDivElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	let actionsEl = $state<HTMLDivElement | null>(null);
	let offset = $state(0); // signed: negative = moved left
	let dragging = $state(false);
	let startX = 0;
	let startY = 0;
	let startOffset = 0;
	let axis: 'x' | 'y' | null = null;
	let touchId = -1;
	let suppressClick = false;

	function maxOpen(): number {
		return actionsEl?.offsetWidth ?? 0;
	}

	function isOpen(): boolean {
		return Math.abs(offset) >= maxOpen() - 1;
	}

	// Rubber-band a raw delta against [min, max]: past the bound the
	// finger keeps moving but the content drags at 40% strength.
	function damp(raw: number, min: number, max: number): number {
		if (raw < min) return min + (raw - min) * 0.4;
		if (raw > max) return max + (raw - max) * 0.4;
		return raw;
	}

	function updateOffset(dx: number) {
		const max = Math.max(maxOpen(), 1);
		const raw = startOffset + dx;
		const min = direction === 'left' ? -max : 0;
		const maxBound = direction === 'left' ? 0 : max;
		offset = damp(raw, min, maxBound);
	}

	function settle(tap: boolean) {
		dragging = false;
		if (tap) {
			if (isOpen()) offset = 0;
			return;
		}
		const max = maxOpen();
		if (max === 0) {
			offset = 0;
			return;
		}
		const magnitude = Math.abs(offset);
		if (magnitude >= threshold || magnitude >= max * 0.5) {
			offset = revealSign() * max;
		} else {
			offset = 0;
		}
	}

	// --- Touch: we own the gesture only once the axis is clearly
	// horizontal; vertical drags pass through to native scrolling.
	function onTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		const t = e.touches[0];
		axis = null;
		startX = t.clientX;
		startY = t.clientY;
		startOffset = offset;
		touchId = t.identifier;
		dragging = true;
	}

	function onTouchMove(e: TouchEvent) {
		if (!dragging) return;
		const t = Array.from(e.touches).find((t) => t.identifier === touchId);
		if (!t) return;
		const dx = t.clientX - startX;
		const dy = t.clientY - startY;

		if (axis === null) {
			if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
			axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
			if (axis === 'y') {
				// Vertical scroll — hand back to the browser.
				dragging = false;
				return;
			}
		}
		if (axis === 'y') return;

		e.preventDefault();
		updateOffset(dx);
	}

	function onTouchEnd(e: TouchEvent) {
		if (!dragging) return;
		const t = Array.from(e.changedTouches).find((t) => t.identifier === touchId);
		const moved = t
			? Math.abs(t.clientX - startX) + Math.abs(t.clientY - startY)
			: Infinity;
		if (moved > 10) suppressClick = true;
		settle(axis !== 'x' || moved < 8);
		axis = null;
	}

	function onTouchCancel() {
		if (!dragging) return;
		offset = startOffset;
		dragging = false;
		axis = null;
	}

	// --- Pointer (mouse / pen): no native scroll to fight, so plain
	// pointer tracking works; touch is handled by the touch handlers above.
	function onPointerDown(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (e.button !== 0) return;
		axis = null;
		startX = e.clientX;
		startY = e.clientY;
		startOffset = offset;
		dragging = true;
		contentEl?.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!dragging) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		if (axis === null) {
			if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
			axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
			if (axis === 'y') {
				dragging = false;
				return;
			}
		}
		if (axis === 'y') return;
		updateOffset(dx);
	}

	function onPointerUp(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!dragging) return;
		const moved = Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY);
		if (moved > 10) suppressClick = true;
		settle(axis !== 'x' || moved < 8);
		axis = null;
	}

	function onPointerCancel(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!dragging) return;
		offset = startOffset;
		dragging = false;
		axis = null;
	}

	// A drag that opens the item also ends with a click on mouse; suppress
	// it so the item doesn't snap shut right after opening.
	function onClickContent() {
		if (suppressClick) {
			suppressClick = false;
			return;
		}
		if (isOpen()) offset = 0;
	}
</script>

<div
	bind:this={rootEl}
	class={cn('relative overflow-hidden', className)}
>
	<!-- Actions layer, pinned to the reveal side -->
	<div
		bind:this={actionsEl}
		class={cn(
			'absolute inset-y-0 flex',
			direction === 'left' ? 'right-0 flex-row' : 'left-0 flex-row-reverse'
		)}
	>
		{@render actions()}
	</div>

	<!-- Content layer, translated over the actions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={contentEl}
		role="group"
		class="relative touch-pan-y select-none"
		style="transform: translateX({offset}px); transition: {dragging ? 'none' : 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)'}"
		ontouchstart={onTouchStart}
		ontouchmove={onTouchMove}
		ontouchend={onTouchEnd}
		ontouchcancel={onTouchCancel}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerCancel}
		onclick={onClickContent}
	>
		{@render children()}
	</div>
</div>
