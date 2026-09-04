<script lang="ts">
	import { cn } from '../../utils.js';
	import { GripVertical, GripHorizontal } from 'lucide-svelte';

	type Direction = 'horizontal' | 'vertical';

	let {
		direction = 'horizontal',
		defaultSize = 50,
		minSize = 20,
		maxSize = 80,
		class: className,
		children,
		first,
		second,
	}: {
		direction?: Direction;
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
		class?: string;
		children?: import('svelte').Snippet;
		first?: import('svelte').Snippet;
		second?: import('svelte').Snippet;
	} = $props();

	// Percentage of the container taken by the first panel.
	let size = $state(defaultSize);
	let dragging = $state(false);
	let container = $state<HTMLDivElement | null>(null);

	function startDrag(e: PointerEvent) {
		dragging = true;
		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || !container) return;
		const rect = container.getBoundingClientRect();
		const total = direction === 'horizontal' ? rect.width : rect.height;
		if (total === 0) return;
		const pos =
			direction === 'horizontal' ? e.clientX - rect.left : e.clientY - rect.top;
		size = Math.max(minSize, Math.min(maxSize, (pos / total) * 100));
	}

	function endDrag() {
		dragging = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		const step = 5;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			size = Math.max(minSize, size - step);
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			size = Math.min(maxSize, size + step);
		} else if (e.key === 'Home') {
			size = minSize;
		} else if (e.key === 'End') {
			size = maxSize;
		}
		e.preventDefault();
	}

	const Grip = $derived(direction === 'horizontal' ? GripVertical : GripHorizontal);
</script>

<div
	bind:this={container}
	style="height: 100%"
	class={cn(
		'flex w-full overflow-hidden',
		direction === 'horizontal' ? 'flex-row' : 'flex-col',
		className
	)}
	data-slot="split-view"
	data-direction={direction}
>
	{#if first && second}
		<div
			class="min-h-0 min-w-0 overflow-auto"
			style={direction === 'horizontal' ? `width: ${size}%` : `height: ${size}%`}
			data-slot="split-view-panel"
		>
			{@render first()}
		</div>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			role="separator"
			tabindex="0"
			aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
			aria-valuenow={size}
			aria-valuemin={minSize}
			aria-valuemax={maxSize}
			aria-label="Resize split view panels"
			class={cn(
				'relative z-10 flex shrink-0 touch-none select-none items-center justify-center outline-none',
				'transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				direction === 'horizontal'
					? 'w-px cursor-col-resize'
					: 'h-px cursor-row-resize',
				dragging ? 'bg-primary/50' : 'bg-border',
				className
			)}
			onpointerdown={startDrag}
			onpointermove={onPointerMove}
			onpointerup={endDrag}
			onpointercancel={endDrag}
			onkeydown={handleKeydown}
		>
			<div
				class={cn(
					'absolute z-10 rounded-full border border-border bg-background transition-colors dark:bg-background',
					dragging && 'border-primary/40 bg-primary/20',
					direction === 'horizontal' ? 'h-8 w-1.5' : 'h-1.5 w-8'
				)}
			>
				<Grip class="absolute inset-0 m-auto size-3 text-muted-foreground" />
			</div>
		</div>
		<div class="min-h-0 min-w-0 flex-1 overflow-auto" data-slot="split-view-panel">
			{@render second()}
		</div>
	{:else}
		<div class="min-h-0 min-w-0 flex-1 overflow-auto">{@render children?.()}</div>
	{/if}
</div>