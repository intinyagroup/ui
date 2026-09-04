<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const heroVariants = tv({
		base: 'flex flex-col items-center justify-center gap-6 px-4 py-16 text-center md:py-24',
		variants: {
			variant: {
				centered: '',
				split: 'flex-row items-center gap-12 text-left lg:flex-row',
				fullwidth: 'min-h-[80vh] bg-[var(--ui-muted)]'
			},
			size: {
				sm: 'py-12',
				default: 'py-16 md:py-24',
				lg: 'py-20 md:py-32'
			}
		},
		defaultVariants: { variant: 'centered', size: 'default' }
	});

	export type HeroVariant = VariantProps<typeof heroVariants>['variant'];
	export type HeroSize = VariantProps<typeof heroVariants>['size'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'centered',
		size = 'default',
		children
	}: {
		ref?: HTMLElement | null;
		class?: string;
		variant?: HeroVariant;
		size?: HeroSize;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<section bind:this={ref} class={cn(heroVariants({ variant, size }), className)}>
	{@render children?.()}
</section>
