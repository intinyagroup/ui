<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		gap = 4,
		divider = false,
		class: className,
		children
	}: {
		gap?: number;
		divider?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

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
		'flex flex-col',
		divider && 'divide-y divide-[var(--ui-border)]',
		gapMap[gap],
		className
	)}
>
	{@render children?.()}
</div>
