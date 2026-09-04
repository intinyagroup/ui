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

<footer class={cn('flex items-center p-6 pt-0', className)} {...restProps}>
	{@render children?.()}
</footer>
