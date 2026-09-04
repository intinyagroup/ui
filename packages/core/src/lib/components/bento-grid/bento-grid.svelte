<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const bentoGridVariants = tv({
		base: 'grid gap-4',
		variants: {
			cols: {
				2: 'grid-cols-1 sm:grid-cols-2',
				3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
				4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
			}
		},
		defaultVariants: { cols: 3 }
	});
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
		cols?: '2' | '3' | '4';
		children?: import('svelte').Snippet;
	} = $props();
</script>

<div bind:this={ref} class={cn(bentoGridVariants({ cols: cols as never }), className)}>
	{@render children?.()}
</div>
