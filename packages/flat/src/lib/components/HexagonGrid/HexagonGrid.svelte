<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const hexagonGridVariants = tv({
		base: 'hex-grid grid',
		variants: {
			columns: {
				2: 'grid-cols-1 sm:grid-cols-2',
				3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
				4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
			}
		},
		defaultVariants: {
			columns: 3
		}
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		columns = 3,
		gap = '1rem',
		children,
		class: className
	}: {
		columns?: 2 | 3 | 4;
		gap?: string;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div
	class={cn(hexagonGridVariants({ columns }), `hex-cols-${columns}`, className)}
	style:--hex-gap={gap}
>
	{@render children?.()}
</div>

<style>
	/* Container: grid gap + vertical breathing room for clipped hex tips */
	:global(.hex-grid) {
		gap: var(--hex-gap);
		padding-block: calc(var(--hex-gap) * 2);
	}

	/* Every direct child becomes a hexagon via clip-path */
	:global(.hex-grid > *) {
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		aspect-ratio: 1 / 1.1547;
	}

	/* 2-col: offset items in rows 2, 4, 6… (indices 3–4, 7–8, 11–12, …) */
	:global(.hex-cols-2 > :nth-child(4n + 3)),
	:global(.hex-cols-2 > :nth-child(4n + 4)) {
		transform: translateX(50%);
		margin-top: -12.5%;
	}

	/* 3-col: offset items in rows 2, 4, 6… (indices 4–6, 10–12, 16–18, …) */
	:global(.hex-cols-3 > :nth-child(6n + 4)),
	:global(.hex-cols-3 > :nth-child(6n + 5)),
	:global(.hex-cols-3 > :nth-child(6n + 6)) {
		transform: translateX(50%);
		margin-top: -12.5%;
	}

	/* 4-col: offset items in rows 2, 4, 6… (indices 5–8, 13–16, 21–24, …) */
	:global(.hex-cols-4 > :nth-child(8n + 5)),
	:global(.hex-cols-4 > :nth-child(8n + 6)),
	:global(.hex-cols-4 > :nth-child(8n + 7)),
	:global(.hex-cols-4 > :nth-child(8n + 8)) {
		transform: translateX(50%);
		margin-top: -12.5%;
	}
</style>
