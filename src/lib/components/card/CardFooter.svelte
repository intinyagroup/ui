<script lang="ts">
	import { cn } from '../../utils.js';
	import { type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: className,
		children,
		...restProps
	}: {
		class?: string;
		children: Snippet;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('flex items-center p-6 pt-0', className)} {...restProps}>
	{@render children?.()}
</div>
