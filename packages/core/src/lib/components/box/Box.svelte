<script lang="ts">
	import { cn } from '../../utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		as = 'div',
		padding = 0,
		class: className,
		children,
		...restProps
	}: {
		as?: keyof HTMLElementTagNameMap;
		padding?: number;
		class?: string;
		children?: import('svelte').Snippet;
	} & HTMLAttributes<HTMLElement> = $props();

	const paddingMap: Record<number, string> = {
		0: 'p-0',
		0.5: 'p-0.5',
		1: 'p-1',
		1.5: 'p-1.5',
		2: 'p-2',
		3: 'p-3',
		4: 'p-4',
		5: 'p-5',
		6: 'p-6',
		8: 'p-8',
		10: 'p-10',
		12: 'p-12',
		16: 'p-16'
	};
</script>

<svelte:element this={as} class={cn(paddingMap[padding], className)} {...restProps}>
	{@render children?.()}
</svelte:element>
