<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const ctaSectionVariants = tv({
		base: 'flex flex-col items-center gap-6 rounded-2xl px-6 py-16 text-center md:py-20',
		variants: {
			variant: {
				primary: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]',
				outline: 'border-2 border-[var(--ui-border)] bg-[var(--ui-card)]',
				muted: 'bg-[var(--ui-muted)]'
			}
		},
		defaultVariants: { variant: 'primary' }
	});

	export type CTASectionVariant = VariantProps<typeof ctaSectionVariants>['variant'];
</script>

<script lang="ts">
	import { type VariantProps } from 'tailwind-variants';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'primary',
		children
	}: {
		ref?: HTMLElement | null;
		class?: string;
		variant?: CTASectionVariant;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<section bind:this={ref} class={cn(ctaSectionVariants({ variant }), className)}>
	{@render children?.()}
</section>
