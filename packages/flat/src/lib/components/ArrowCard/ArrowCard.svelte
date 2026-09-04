<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
	type Direction = 'left' | 'right';

	let {
		title,
		direction = 'right',
		color = 'blue',
		children,
		class: className
	}: {
		title?: string;
		direction?: Direction;
		color?: Color;
		children?: import('svelte').Snippet;
		class?: string;
	} = $props();

	const colorMap: Record<Color, string> = {
		red: 'bg-[var(--flat-red)]',
		blue: 'bg-[var(--flat-blue)]',
		green: 'bg-[var(--flat-green)]',
		purple: 'bg-[var(--flat-purple)]',
		pink: 'bg-[var(--flat-pink)]',
		orange: 'bg-[var(--flat-orange)]',
		teal: 'bg-[var(--flat-teal)]'
	};

	const clipPaths: Record<Direction, string> = {
		right: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)',
		left: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)'
	};
</script>

<div
	class={cn(
		'flex items-center px-8 py-4 text-white',
		'select-none',
		'hover:scale-[1.02] transition-transform duration-[var(--ui-transition-base)]',
		colorMap[color],
		className
	)}
	style:clip-path={clipPaths[direction]}
>
	<div class="flex flex-col text-left">
		{#if title}
			<h3 class="text-base font-bold leading-tight">{title}</h3>
		{/if}
		{#if children}
			<div class="mt-1">
				{@render children()}
			</div>
		{/if}
	</div>
</div>
