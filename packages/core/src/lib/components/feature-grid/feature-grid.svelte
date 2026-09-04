<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const featureGridVariants = tv({
		base: 'grid gap-6',
		variants: {
			cols: {
				2: 'grid-cols-1 sm:grid-cols-2',
				3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
				4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
			}
		},
		defaultVariants: { cols: 3 }
	});

	export type FeatureGridCols = '2' | '3' | '4';
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		cols = '3',
		children
	}: {
		ref?: HTMLElement | null;
		class?: string;
		cols?: FeatureGridCols;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<div bind:this={ref} class={cn(featureGridVariants({ cols: cols as never }), className)}>
	{@render children?.()}
</div>
