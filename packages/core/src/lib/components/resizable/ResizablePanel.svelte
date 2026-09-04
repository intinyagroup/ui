<script lang="ts" module>
	let panelIdCounter = 0;
</script>

<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	let {
		defaultSize = 0,
		minSize = 10,
		maxSize = 90,
		class: className,
		collapsedSize = 0,
		collapsible = false,
		ref = $bindable(null),
		children
	}: {
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
		class?: string;
		collapsedSize?: number;
		collapsible?: boolean;
		ref?: HTMLElement | null;
		children?: Snippet;
	} = $props();

	const id = `resizable-panel-${++panelIdCounter}`;

	const ctx = getContext<{
		direction: string;
		panelOrder: string[];
		registerPanel: (
			id: string,
			defaultSize: number,
			minSize: number,
			maxSize: number
		) => void;
		unregisterPanel: (id: string) => void;
		getPanelSize: (id: string) => number;
		resizePanel: (id: string, size: number) => void;
	}>("resizable-state");

	// Register once on mount, unregister on destroy
	$effect(() => {
		const ds = defaultSize;
		const mins = minSize;
		const maxs = maxSize;
		ctx.registerPanel(id, ds, mins, maxs);
		return () => {
			ctx.unregisterPanel(id);
		};
	});

	// Derived flex basis from current size
	let panelSize = $derived(ctx.getPanelSize(id));
	let isHorizontal = $derived(ctx.direction === "horizontal");

	let flexBasis = $derived(`${panelSize}%`);
</script>

<div
	bind:this={ref}
	role="group"
	aria-label="Resizable panel"
	data-slot="resizable-panel"
	data-panel-id={id}
	class={cn(
		"overflow-hidden",
		isHorizontal ? "h-full" : "w-full",
		className
	)}
	style:flex-basis={flexBasis}
	style:min-width={isHorizontal ? `${minSize}%` : undefined}
	style:max-width={isHorizontal ? `${maxSize}%` : undefined}
	style:min-height={!isHorizontal ? `${minSize}%` : undefined}
	style:max-height={!isHorizontal ? `${maxSize}%` : undefined}
	style:overflow="hidden"
>
	{@render children?.()}
</div>
