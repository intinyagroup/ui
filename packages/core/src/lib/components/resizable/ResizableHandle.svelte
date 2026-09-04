<script lang="ts">
	import { getContext } from "svelte";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		onDragStart,
		onDragEnd,
		disabled = false
	}: {
		class?: string;
		ref?: HTMLElement | null;
		onDragStart?: () => void;
		onDragEnd?: () => void;
		disabled?: boolean;
	} = $props();

	const ctx = getContext<{
		direction: string;
		panelOrder: string[];
		resizeAdjacentPanels: (handleIndex: number, deltaPercentage: number) => void;
		getPanelSize: (id: string) => number;
	}>("resizable-state");

	let isDragging = $state(false);
	let isHorizontal = $derived(ctx.direction === "horizontal");

	// ---- Find which handle index this is ----
	function getHandleIndex(): number {
		if (!ref?.parentElement) return -1;
		const siblings = Array.from(ref.parentElement.children).filter(
			(el) => el.getAttribute("data-slot") === "resizable-handle"
		);
		return siblings.indexOf(ref);
	}

	// ---- Drag handling ----
	function onPointerDown(e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		e.stopPropagation();

		isDragging = true;
		onDragStart?.();

		const container = ref?.closest("[data-slot='resizable-panel-group']");
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const handleIndex = getHandleIndex();
		const totalSize = isHorizontal ? rect.width : rect.height;
		const startPos = isHorizontal ? e.clientX : e.clientY;

		function onPointerMove(moveEvent: PointerEvent) {
			moveEvent.preventDefault();
			const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
			const deltaPixels = currentPos - startPos;
			const deltaPercentage = (deltaPixels / totalSize) * 100;
			ctx.resizeAdjacentPanels(handleIndex, deltaPercentage);
		}

		function onPointerUp() {
			isDragging = false;
			onDragEnd?.();
			document.removeEventListener("pointermove", onPointerMove);
			document.removeEventListener("pointerup", onPointerUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			ref?.releasePointerCapture(e.pointerId);
		}

		document.addEventListener("pointermove", onPointerMove);
		document.addEventListener("pointerup", onPointerUp);
		document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
		document.body.style.userSelect = "none";
		ref?.setPointerCapture(e.pointerId);
	}

	// ---- Keyboard handling ----
	function onKeyDown(e: KeyboardEvent) {
		if (disabled) return;

		const STEP = 5;
		const handleIndex = getHandleIndex();
		if (handleIndex < 0) return;

		switch (e.key) {
			case "ArrowLeft":
			case "ArrowUp": {
				e.preventDefault();
				ctx.resizeAdjacentPanels(handleIndex, -STEP);
				break;
			}
			case "ArrowRight":
			case "ArrowDown": {
				e.preventDefault();
				ctx.resizeAdjacentPanels(handleIndex, STEP);
				break;
			}
			case "Home": {
				e.preventDefault();
				const leftId = ctx.panelOrder[handleIndex];
				if (leftId) {
					const leftSize = ctx.getPanelSize(leftId);
					ctx.resizeAdjacentPanels(handleIndex, -(leftSize));
				}
				break;
			}
			case "End": {
				e.preventDefault();
				const rightId = ctx.panelOrder[handleIndex + 1];
				if (rightId) {
					const rightSize = ctx.getPanelSize(rightId);
					ctx.resizeAdjacentPanels(handleIndex, rightSize);
				}
				break;
			}
		}
	}
</script>

{#if !disabled}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={ref}
		role="separator"
		tabindex="0"
		aria-orientation={isHorizontal ? "vertical" : "horizontal"}
		aria-valuenow={50}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label="Resize panels"
		data-slot="resizable-handle"
		class={cn(
			"relative z-10 flex shrink-0 items-center justify-center",
			"transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			"touch-none select-none",
			isHorizontal
				? "w-px cursor-col-resize"
				: "h-px cursor-row-resize",
			isDragging && "bg-primary/50",
			!isDragging && "bg-border",
			className
		)}
		onpointerdown={onPointerDown}
		onkeydown={onKeyDown}
	>
		<!-- Drag indicator dot -->
		<div
			class={cn(
				"absolute rounded-full border border-border bg-background transition-colors",
				"z-10",
				isDragging && "bg-primary/20 border-primary/40",
				isHorizontal
					? "h-8 w-1.5"
					: "h-1.5 w-8"
			)}
		></div>
	</div>
{/if}
