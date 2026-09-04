<script lang="ts">
	import { setContext, type Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	type Direction = "horizontal" | "vertical";

	let {
		direction = "horizontal",
		class: className,
		children
	}: {
		direction?: Direction;
		class?: string;
		children?: Snippet;
	} = $props();

	// ---- Panel registry ----
	type PanelState = {
		id: string;
		size: number;
		minSize: number;
		maxSize: number;
	};

	let panelStates = $state<Map<string, PanelState>>(new Map());
	let panelOrder = $state<string[]>([]);

	// ---- Register / unregister ----
	function registerPanel(
		id: string,
		defaultSize: number,
		minSize: number,
		maxSize: number
	) {
		if (!panelStates.has(id)) {
			panelStates.set(id, {
				id,
				size: defaultSize,
				minSize,
				maxSize
			});
			panelOrder = [...panelOrder, id];

			// Auto-distribute remaining size if defaults don't sum to 100
			const totalDefault = panelOrder.reduce(
				(sum, pid) => sum + (panelStates.get(pid)?.size ?? 0),
				0
			);
			if (totalDefault > 100) {
				// Scale down proportionally to fit 100%
				for (const pid of panelOrder) {
					const panel = panelStates.get(pid);
					if (panel) {
						panel.size = (panel.size / totalDefault) * 100;
					}
				}
			} else if (totalDefault < 100) {
				// Distribute remaining space evenly among panels without explicit defaults
				const remaining = 100 - totalDefault;
				const panelsWithDefault = panelOrder.filter((pid) => {
					const p = panelStates.get(pid);
					return p && p.size !== defaultSize;
				}).length;
				const autoCount = panelOrder.length - panelsWithDefault;
				if (autoCount > 0) {
					const autoShare = remaining / autoCount;
					for (const pid of panelOrder) {
						const panel = panelStates.get(pid);
						if (panel && panel.size === defaultSize && panel.id !== id) {
							panel.size = autoShare;
						}
					}
				}
			}
		}
	}

	function unregisterPanel(id: string) {
		panelStates.delete(id);
		panelOrder = panelOrder.filter((pid) => pid !== id);
	}

	// ---- Resize logic ----
	function resizePanel(id: string, newSize: number) {
		const panel = panelStates.get(id);
		if (panel) {
			panel.size = Math.max(panel.minSize, Math.min(panel.maxSize, newSize));
		}
	}

	function resizeAdjacentPanels(
		handleIndex: number,
		deltaPercentage: number
	) {
		const leftId = panelOrder[handleIndex];
		const rightId = panelOrder[handleIndex + 1];
		if (!leftId || !rightId) return;

		const leftPanel = panelStates.get(leftId);
		const rightPanel = panelStates.get(rightId);
		if (!leftPanel || !rightPanel) return;

		const leftNewSize = leftPanel.size + deltaPercentage;
		const rightNewSize = rightPanel.size - deltaPercentage;

		// Clamp within constraints
		const leftClamped = Math.max(
			leftPanel.minSize,
			Math.min(leftPanel.maxSize, leftNewSize)
		);
		const rightClamped = Math.max(
			rightPanel.minSize,
			Math.min(rightPanel.maxSize, rightNewSize)
		);

		// Compute actual delta after clamping
		const actualLeftDelta = leftClamped - leftPanel.size;
		const actualRightDelta = rightClamped - rightPanel.size;

		// Apply — the sum should stay the same
		leftPanel.size = leftClamped;
		rightPanel.size = rightClamped;
	}

	// ---- Context ----
	setContext("resizable-state", {
		get direction() {
			return direction;
		},
		get panelOrder() {
			return panelOrder;
		},
		registerPanel,
		unregisterPanel,
		resizePanel,
		resizeAdjacentPanels,
		getPanelState(id: string) {
			return panelStates.get(id);
		},
		getPanelSize(id: string): number {
			return panelStates.get(id)?.size ?? 0;
		}
	});
</script>

<div
	class={cn(
		"flex h-full w-full",
		direction === "horizontal" ? "flex-row" : "flex-col",
		className
	)}
	data-slot="resizable-panel-group"
	data-direction={direction}
>
	{@render children?.()}
</div>
