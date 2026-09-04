<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		value = 0,
		label = '',
		prefix = '',
		suffix = '',
		duration = 2000,
		class: className,
		...restProps
	}: {
		value: number;
		label: string;
		prefix?: string;
		suffix?: string;
		duration?: number;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();

	let displayValue = $state(0);
	let element = $state<HTMLDivElement | null>(null);
	let hasAnimated = $state(false);

	function easeOutCubic(t: number): number {
		return 1 - Math.pow(1 - t, 3);
	}

	function animateCount(start: number, end: number, duration: number) {
		const startTime = performance.now();

		function update(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeOutCubic(progress);

			displayValue = Math.round(start + (end - start) * easedProgress);

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	}

	onMount(() => {
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;
						animateCount(0, value, duration);
					}
				});
			},
			{ threshold: 0.5 }
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	});
</script>

<div
	bind:this={element}
	class={cn('text-center', className)}
	{...restProps}
>
	<div class="text-4xl font-bold tracking-tight text-foreground">
		{prefix}{displayValue.toLocaleString()}{suffix}
	</div>
	{#if label}
		<p class="mt-2 text-sm text-muted-foreground">{label}</p>
	{/if}
</div>
