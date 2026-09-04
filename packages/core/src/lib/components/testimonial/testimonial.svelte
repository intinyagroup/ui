<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const testimonialVariants = tv({
		base: 'relative flex flex-col gap-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-6 shadow-sm',
		variants: {},
		defaultVariants: {}
	});
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children
	}: {
		ref?: HTMLElement | null;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<blockquote bind:this={ref} class={cn(testimonialVariants(), className)}>
	<div class="absolute left-6 top-4 text-5xl font-bold text-[var(--ui-primary)]/20 select-none">&ldquo;</div>
	{@render children?.()}
</blockquote>
