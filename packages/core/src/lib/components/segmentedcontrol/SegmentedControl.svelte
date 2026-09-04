<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		value,
		options,
		class: className
	}: {
		value: string | number;
		options: { value: string | number; label: string }[];
		class?: string;
	} = $props();

	let track = $state<HTMLDivElement | null>(null);
	let thumbEl = $state<HTMLDivElement | null>(null);

	// The active pill glides between options. Measure only when it moves or
	// the options change, so resize/orientation changes stay correct.
	$effect(() => {
		if (!track || !thumbEl) return;
		const idx = options.findIndex((o) => o.value === value);
		if (idx < 0) return;
		const active = track.children[idx] as HTMLElement | undefined;
		if (!active) return;
		const trackRect = track.getBoundingClientRect();
		const rect = active.getBoundingClientRect();
		thumbEl.style.width = `${rect.width}px`;
		thumbEl.style.transform = `translateX(${rect.left - trackRect.left}px)`;
	});

	// Re-measure when the window is resized or the device orientation
	// changes (mobile landscape <-> portrait), not just on value change.
	$effect(() => {
		if (!track || !thumbEl) return;
		const onResize = () => {
			const idx = options.findIndex((o) => o.value === value);
			if (idx < 0) return;
			const active = track.children[idx] as HTMLElement | undefined;
			if (!active) return;
			const trackRect = track.getBoundingClientRect();
			const rect = active.getBoundingClientRect();
			thumbEl.style.width = `${rect.width}px`;
			thumbEl.style.transform = `translateX(${rect.left - trackRect.left}px)`;
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<div
	class={cn(
		'relative inline-flex h-8 max-w-full select-none rounded-full bg-[var(--ui-muted)] p-1',
		className
	)}
	role="tablist"
	aria-label="Segmented control"
>
	<div bind:this={track} class="relative flex h-full items-stretch">
		<div
			bind:this={thumbEl}
			class="pointer-events-none absolute top-0 h-full rounded-full bg-[var(--ui-background)] shadow-[var(--ui-shadow-sm)] transition-[width,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
			aria-hidden="true"
		></div>
		{#each options as option (option.value)}
			<button
				type="button"
				role="tab"
				aria-selected={option.value === value}
				tabindex={option.value === value ? 0 : -1}
				class={cn(
					'relative z-10 flex min-w-0 cursor-pointer touch-manipulation select-none items-center justify-center whitespace-nowrap rounded-full px-4 text-[13px] font-semibold leading-none transition-colors duration-[var(--ui-transition-fast)]',
					option.value === value
						? 'text-[var(--ui-foreground)]'
						: 'text-[var(--ui-muted-foreground)]'
				)}
				onclick={() => (value = option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
</div>
