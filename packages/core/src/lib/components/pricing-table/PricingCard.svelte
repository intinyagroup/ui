<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { tv } from 'tailwind-variants';
	import type { HTMLAttributes } from 'svelte/elements';

	const pricingCardVariants = tv({
		base: 'relative flex flex-col rounded-2xl border bg-[var(--ui-card)] p-8 text-[var(--ui-card-foreground)] shadow-sm transition-all duration-200',
		variants: {
			highlighted: {
				true: 'border-[var(--ui-primary)] shadow-lg scale-[1.02] z-10',
				false: 'border-[var(--ui-border)] hover:-translate-y-0.5 hover:shadow-md'
			}
		},
		defaultVariants: {
			highlighted: false
		}
	});

	let {
		ref = $bindable(null),
		class: className,
		name,
		price,
		description,
		features = [],
		highlighted = false,
		cta,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		name: string;
		price: string;
		description: string;
		features?: string[];
		highlighted?: boolean;
		cta?: { label: string; href: string };
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<article
	bind:this={ref}
	class={cn(pricingCardVariants({ highlighted }), className)}
	{...restProps}
>
	{#if highlighted}
		<div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--ui-primary)] to-transparent"></div>
	{/if}

	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{name}</h3>
		<p class="text-sm text-[var(--ui-muted-foreground)]">{description}</p>
	</div>

	<div class="mt-4 mb-6">
		<span class="text-4xl font-bold tracking-tight">{price}</span>
	</div>

	{#if features.length > 0}
		<ul class="flex flex-1 flex-col gap-3">
			{#each features as feature}
				<li class="flex items-start gap-2 text-sm text-[var(--ui-muted-foreground)]">
					<svg
						class="mt-0.5 size-4 shrink-0 text-[var(--ui-primary)]"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
					<span>{feature}</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#if cta}
		<div class="mt-8">
			<a
				href={cta.href}
				class={cn(
					'inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors outline-none',
					highlighted
						? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] hover:bg-[var(--ui-primary)]/90'
						: 'border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-card-foreground)] hover:bg-[var(--ui-muted)]'
				)}
			>
				{cta.label}
			</a>
		</div>
	{/if}
</article>
