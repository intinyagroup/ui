<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Color = 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';

	let {
		title,
		color = 'blue',
		children,
		class: className
	}: {
		title?: string;
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

	const clipPath = 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)';
</script>

<div
	class={cn(
		'flex items-center px-12 py-6 text-white',
		'select-none',
		'hover:scale-[1.02] transition-transform duration-[var(--ui-transition-base)]',
		colorMap[color],
		className
	)}
	style:clip-path={clipPath}
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
