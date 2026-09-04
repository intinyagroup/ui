<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';

	let {
		title,
		description,
		color = 'blue',
		children,
		class: className
	}: {
		title?: string;
		description?: string;
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

	const clipPath =
		'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center p-8 text-center text-white',
		'aspect-square select-none',
		'hover:scale-[1.02] transition-transform duration-[var(--ui-transition-base)]',
		colorMap[color],
		className
	)}
	style:clip-path={clipPath}
>
	<div class="flex flex-col items-center justify-center">
		{#if title}
			<h3 class="text-lg font-bold leading-tight">{title}</h3>
		{/if}
		{#if description}
			<p class="mt-2 text-sm opacity-90">{description}</p>
		{/if}
		{#if children}
			<div class="mt-2">
				{@render children()}
			</div>
		{/if}
	</div>
</div>
