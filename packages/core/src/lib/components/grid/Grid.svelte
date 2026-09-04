<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		cols = 1,
		sm,
		md,
		lg,
		gap = 4,
		class: className,
		children
	}: {
		cols?: 1 | 2 | 3 | 4 | 5 | 6;
		sm?: 2 | 3 | 4 | 5 | 6;
		md?: 2 | 3 | 4 | 5 | 6;
		lg?: 2 | 3 | 4 | 5 | 6;
		gap?: number;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

	const colMap: Record<number, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		5: 'grid-cols-5',
		6: 'grid-cols-6'
	};

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
		'grid',
		colMap[cols],
		sm && `sm:${colMap[sm]}`,
		md && `md:${colMap[md]}`,
		lg && `lg:${colMap[lg]}`,
		gapMap[gap],
		className
	)}
>
	{@render children?.()}
</div>
