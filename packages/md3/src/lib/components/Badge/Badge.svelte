<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	const badgeVariants = tv({
		base: 'inline-flex shrink-0 items-center justify-center font-medium',
		variants: {
			variant: {
				dot: 'h-2 w-2 rounded-full',
				number: 'h-5 min-w-5 rounded-full px-1.5 text-xs',
				icon: 'h-5 w-5 rounded-full',
			},
		},
		defaultVariants: {
			variant: 'dot',
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		variant = 'dot',
		count,
		max = 99,
		class: className,
		children,
	}: {
		variant?: BadgeVariant;
		count?: number;
		max?: number;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

	let displayCount = $derived(
		count === undefined ? '' : count > max ? `${max}+` : `${count}`
	);

	let resolvedClasses = $derived(
		cn(
			badgeVariants({ variant }),
			'bg-[var(--ui-error)]',
			variant === 'number' && 'text-[var(--ui-on-error)]',
			variant === 'icon' && 'text-[var(--ui-on-error)]',
			className
		)
	);
</script>

<span class={resolvedClasses}>
	{#if variant === 'number' && displayCount}
		{displayCount}
	{:else if children}
		{@render children()}
	{/if}
</span>
