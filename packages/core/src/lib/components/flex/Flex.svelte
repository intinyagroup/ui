<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		direction = 'row',
		align = 'stretch',
		justify = 'start',
		gap = 0,
		wrap = false,
		class: className,
		children
	}: {
		direction?: 'row' | 'col';
		align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
		justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
		gap?: number;
		wrap?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

	const alignMap = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
		stretch: 'items-stretch',
		baseline: 'items-baseline'
	} as const;

	const justifyMap = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
		between: 'justify-between',
		around: 'justify-around',
		evenly: 'justify-evenly'
	} as const;

	const gapMap: Record<number, string> = {
		0: 'gap-0',
		0.5: 'gap-0.5',
		1: 'gap-1',
		1.5: 'gap-1.5',
		2: 'gap-2',
		3: 'gap-3',
		4: 'gap-4',
		5: 'gap-5',
		6: 'gap-6',
		8: 'gap-8',
		10: 'gap-10',
		12: 'gap-12',
		16: 'gap-16'
	};
</script>

<div
	class={cn(
		'flex',
		direction === 'col' && 'flex-col',
		alignMap[align],
		justifyMap[justify],
		wrap && 'flex-wrap',
		gapMap[gap],
		className
	)}
>
	{@render children?.()}
</div>
