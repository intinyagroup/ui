<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { ChevronLeft, ChevronRight, Quote } from 'lucide-svelte';

	type Testimonial = {
		quote: string;
		author: string;
		role: string;
		avatar?: string;
	};

	let {
		ref = $bindable(null),
		class: className,
		testimonials = [],
		autoplay = true,
		interval = 5000,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		testimonials?: Testimonial[];
		autoplay?: boolean;
		interval?: number;
		[key: string]: unknown;
	} = $props();

	let current = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;
	let touchStartX = 0;
	let touchDeltaX = 0;
	let isDragging = $state(false);
	let direction = $state<'next' | 'prev'>('next');

	let total = $derived(testimonials.length);

	function goTo(index: number) {
		const nextIndex = ((index % total) + total) % total;
		if (nextIndex > current) {
			direction = 'next';
		} else if (nextIndex < current) {
			direction = 'prev';
		}
		current = nextIndex;
	}

	function next() {
		direction = 'next';
		goTo(current + 1);
	}

	function prev() {
		direction = 'prev';
		goTo(current - 1);
	}

	function startAutoplay() {
		if (!autoplay || total <= 1) return;
		clearInterval(timer);
		timer = setInterval(next, interval);
	}

	function stopAutoplay() {
		clearInterval(timer);
	}

	function handleTouchStart(e: TouchEvent) {
		stopAutoplay();
		touchStartX = e.touches[0].clientX;
		touchDeltaX = 0;
		isDragging = true;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging) return;
		touchDeltaX = e.touches[0].clientX - touchStartX;
	}

	function handleTouchEnd() {
		if (!isDragging) return;
		isDragging = false;

		const threshold = 50;
		if (touchDeltaX < -threshold) {
			next();
		} else if (touchDeltaX > threshold) {
			prev();
		}

		startAutoplay();
	}

	$effect(() => {
		startAutoplay();
		return () => stopAutoplay();
	});
</script>

<div
	bind:this={ref}
	class={cn('group/testimonial-carousel relative', className)}
	role="region"
	aria-label="Testimonial carousel"
	aria-roledescription="carousel"
	onmouseenter={stopAutoplay}
	onmouseleave={startAutoplay}
	{...restProps}
>
	<!-- Testimonial slides -->
	<div
		class="relative overflow-hidden"
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
	>
		{#each testimonials as testimonial, i (i)}
			<div
				class={cn(
					'absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center transition-all duration-500 ease-in-out',
					i === current
						? 'translate-x-0 opacity-100'
						: i === (current + 1) % total
							? 'translate-x-full opacity-0'
							: '-translate-x-full opacity-0'
				)}
				role="group"
				aria-roledescription="slide"
				aria-label="Testimonial {i + 1} of {total}"
				aria-hidden={i !== current}
			>
				<div class="relative">
					<Quote class="absolute -left-4 -top-2 size-8 text-[var(--ui-primary)]/20" aria-hidden="true" />
					<p class="text-lg leading-relaxed text-[var(--ui-foreground)] max-w-2xl italic">
						&ldquo;{testimonial.quote}&rdquo;
					</p>
				</div>

				<div class="flex items-center gap-4">
					{#if testimonial.avatar}
						<img
							src={testimonial.avatar}
							alt={testimonial.author}
							class="size-12 rounded-full object-cover ring-2 ring-[var(--ui-primary)]/20"
						/>
					{:else}
						<div class="flex size-12 items-center justify-center rounded-full bg-[var(--ui-primary)]/10 text-[var(--ui-primary)] font-semibold text-lg">
							{testimonial.author.charAt(0).toUpperCase()}
						</div>
					{/if}
					<div class="text-left">
						<p class="font-semibold text-[var(--ui-foreground)]">{testimonial.author}</p>
						<p class="text-sm text-[var(--ui-muted-foreground)]">{testimonial.role}</p>
					</div>
				</div>
			</div>
		{/each}

		<!-- Empty state -->
		{#if total === 0}
			<div class="flex items-center justify-center py-16 text-[var(--ui-muted-foreground)]">
				No testimonials to display
			</div>
		{/if}
	</div>

	<!-- Previous button -->
	{#if total > 1}
		<button
			onclick={prev}
			class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--ui-background)]/80 p-2 shadow-md backdrop-blur-sm opacity-0 group-hover/testimonial-carousel:opacity-100 transition-opacity hover:bg-[var(--ui-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]"
			aria-label="Previous testimonial"
		>
			<ChevronLeft class="size-5" />
		</button>

		<button
			onclick={next}
			class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--ui-background)]/80 p-2 shadow-md backdrop-blur-sm opacity-0 group-hover/testimonial-carousel:opacity-100 transition-opacity hover:bg-[var(--ui-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]"
			aria-label="Next testimonial"
		>
			<ChevronRight class="size-5" />
		</button>
	{/if}

	<!-- Navigation dots -->
	{#if total > 1}
		<div class="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
			{#each { length: total } as _, i}
				<button
					onclick={() => goTo(i)}
					class={cn(
						'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-2',
						i === current
							? 'w-6 bg-[var(--ui-primary)]'
							: 'w-2 bg-[var(--ui-muted-foreground)]/30 hover:bg-[var(--ui-muted-foreground)]/50'
					)}
					role="tab"
					aria-selected={i === current}
					aria-label="Go to testimonial {i + 1}"
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Prevent text selection during swipe */
	div[ontouchstart] {
		touch-action: pan-y;
		-webkit-user-select: none;
		user-select: none;
	}
</style>
