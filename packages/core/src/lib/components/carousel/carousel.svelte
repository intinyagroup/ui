<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		autoplay = false,
		interval = 4000,
		showDots = true,
		showArrows = true,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		children?: import('svelte').Snippet;
		autoplay?: boolean;
		interval?: number;
		showDots?: boolean;
		showArrows?: boolean;
		[key: string]: unknown;
	} = $props();

	let current = $state(0);
	let total = $state(0);
	let container = $state<HTMLElement | null>(null);
	let timer: ReturnType<typeof setInterval> | undefined;

	function updateTotal() {
		if (!container) return;
		total = container.children.length;
	}

	function scrollTo(index: number) {
		if (!container) return;
		const clamped = Math.max(0, Math.min(index, total - 1));
		current = clamped;
		container.children[clamped]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
	}

	function next() { scrollTo(current + 1); }
	function prev() { scrollTo(current - 1); }

	function onScroll() {
		if (!container) return;
		const scrollLeft = container.scrollLeft;
		const childWidth = container.children[0]?.getBoundingClientRect().width ?? 1;
		current = Math.round(scrollLeft / childWidth);
	}

	function startAutoplay() {
		if (!autoplay) return;
		timer = setInterval(next, interval);
	}

	function stopAutoplay() {
		if (timer) clearInterval(timer);
	}

	$effect(() => {
		updateTotal();
		if (autoplay) startAutoplay();
		return () => stopAutoplay();
	});
</script>

<div
	class={cn('group/carousel relative', className)}
	onmouseenter={stopAutoplay}
	onmouseleave={startAutoplay}
	role="region"
	aria-label="Carousel"
	{...restProps}
>
	{#if showArrows && total > 1}
		<button
			onclick={prev}
			class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--ui-background)]/80 p-2 shadow-md backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity"
			aria-label="Previous"
		>
			<ChevronLeft class="size-5" />
		</button>
		<button
			onclick={next}
			class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--ui-background)]/80 p-2 shadow-md backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity"
			aria-label="Next"
		>
			<ChevronRight class="size-5" />
		</button>
	{/if}

	<div
		bind:this={container}
		onscroll={onScroll}
		class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-8 py-2"
	>
		{@render children?.()}
	</div>

	{#if showDots && total > 1}
		<div class="flex justify-center gap-2 mt-4">
			{#each { length: total } as _, i}
				<button
					onclick={() => scrollTo(i)}
					class="h-2 rounded-full transition-all {i === current
						? 'w-6 bg-[var(--ui-primary)]'
						: 'w-2 bg-[var(--ui-muted-foreground)]/30 hover:bg-[var(--ui-muted-foreground)]/50'}"
					aria-label="Go to slide {i + 1}"
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Each child is a snap target */
	div > :global(*) {
		scroll-snap-align: start;
		flex-shrink: 0;
		min-width: 0;
	}
</style>
