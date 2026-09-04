<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
	type Size = 'sm' | 'md' | 'lg';

	let {
		count = 6,
		color = 'blue',
		size = 'md',
		class: className
	}: {
		count?: number;
		color?: Color;
		size?: Size;
		class?: string;
	} = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16'
	};

	const colorMap: Record<Color, string> = {
		red: 'bg-[var(--flat-red)]',
		blue: 'bg-[var(--flat-blue)]',
		green: 'bg-[var(--flat-green)]',
		purple: 'bg-[var(--flat-purple)]',
		pink: 'bg-[var(--flat-pink)]',
		orange: 'bg-[var(--flat-orange)]',
		teal: 'bg-[var(--flat-teal)]'
	};
</script>

<div
	class={cn('flex flex-wrap items-center justify-center gap-3', className)}
>
	{#each Array.from({ length: count }) as _, i}
		<div
			class={cn('rounded-full', sizeClasses[size], colorMap[color])}
		/>
	{/each}
</div>
