<script lang="ts">
	import { cn } from '$lib/utils';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
	type Size = 'sm' | 'md' | 'lg';

	let {
		color = 'red',
		label,
		size = 'md',
		class: className
	}: {
		color?: Color;
		label: string;
		size?: Size;
		class?: string;
	} = $props();

	const sizeClasses: Record<Size, string> = {
		sm: 'w-12 h-12 text-[10px]',
		md: 'w-16 h-16 text-xs',
		lg: 'w-20 h-20 text-sm'
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
	class={cn(
		'flex items-center justify-center font-bold text-white',
		'clip-[var(--clip-diamond)]',
		sizeClasses[size],
		colorMap[color],
		className
	)}
	style="clip-path: var(--clip-diamond);"
>
	{label}
</div>
