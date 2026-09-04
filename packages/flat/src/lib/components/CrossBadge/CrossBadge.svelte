<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
	type Size = 'sm' | 'md' | 'lg';

	let {
		label,
		color = 'red',
		size = 'md',
		class: className
	}: {
		label: string;
		color?: Color;
		size?: Size;
		class?: string;
	} = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'w-10 h-10 text-[10px]',
		md: 'w-14 h-14 text-xs',
		lg: 'w-18 h-18 text-sm'
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

	const clipPath =
		'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)';
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
