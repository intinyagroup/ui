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
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<header class={cn('flex flex-col space-y-1.5 p-6', className)} {...restProps}>
	{@render children?.()}
</header>
