<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const blobCardVariants = tv({
		base: 'relative p-8 text-white transition-transform duration-[var(--ui-transition-base)] ease-[cubic-bezier(0.2,0,0,1)] cursor-pointer select-none hover:scale-[1.02]',
		variants: {
			color: {
				red: 'bg-[var(--flat-red)]',
				blue: 'bg-[var(--flat-blue)]',
				green: 'bg-[var(--flat-green)]',
				purple: 'bg-[var(--flat-purple)]',
				pink: 'bg-[var(--flat-pink)]',
				orange: 'bg-[var(--flat-orange)]',
				teal: 'bg-[var(--flat-teal)]'
			}
		},
		defaultVariants: {
			color: 'blue'
		}
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		color = 'blue',
		title,
		description,
		children,
		class: className
	}: {
		color?: 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
		title?: string;
		description?: string;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="relative">
	<!-- SVG blob clip-path definition (unique per instance via generated id) -->
	<svg width="0" height="0" class="absolute">
		<clipPath id="blob-clip" clipPathUnits="objectBoundingBox">
			<path
				d="M0.5,0.02 C0.75,0.02,0.98,0.15,0.98,0.4 C0.98,0.65,0.85,0.98,0.55,0.98 C0.25,0.98,0.02,0.75,0.02,0.5 C0.02,0.25,0.15,0.02,0.5,0.02Z"
			/>
		</clipPath>
	</svg>

	<div
		class={cn(blobCardVariants({ color }), 'aspect-square', className)}
		style="clip-path: url(#blob-clip);"
	>
		<div class="flex h-full flex-col items-center justify-center p-4 text-center">
			{#if title}
				<h3 class="text-lg font-bold leading-tight">{title}</h3>
			{/if}
			{#if description}
				<p class="mt-2 text-sm opacity-90">{description}</p>
			{/if}
			{#if children}
				<div class="mt-2">
					{@render children()}
				</div>
			{/if}
		</div>
	</div>
</div>
