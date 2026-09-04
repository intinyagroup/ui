<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
	type Size = 'sm' | 'md' | 'lg';

	let {
		label,
		color = 'blue',
		size = 'md',
		class: className
	}: {
		label: string;
		color?: Color;
		size?: Size;
		class?: string;
	} = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'w-16 h-10 text-[10px]',
		md: 'w-20 h-12 text-xs',
		lg: 'w-28 h-16 text-sm'
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

	const clipPath = 'ellipse(50% 50% at 50% 50%)';
</script>

<div
	class={cn(
		'flex items-center justify-center font-bold text-white',
		sizeClasses[size],
		colorMap[color],
		className
	)}
	style:clip-path={clipPath}
>
	{label}
</div>
