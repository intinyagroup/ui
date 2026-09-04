<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
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

<div
	class={cn(
		'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
