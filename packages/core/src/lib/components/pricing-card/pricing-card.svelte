<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const pricingCardVariants = tv({
		base: 'relative flex flex-col gap-4 rounded-2xl border bg-[var(--ui-card)] p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
		variants: {
			variant: {
				default: 'border-[var(--ui-border)]',
				featured: 'border-[var(--ui-primary)] shadow-md scale-[1.02] hover:shadow-lg'
			}
		},
		defaultVariants: { variant: 'default' }
	});

	export type PricingCardVariant = VariantProps<typeof pricingCardVariants>['variant'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children
	}: {
		ref?: HTMLElement | null;
		class?: string;
		variant?: PricingCardVariant;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<div bind:this={ref} class={cn(pricingCardVariants({ variant }), className)}>
	{@render children?.()}
</div>
