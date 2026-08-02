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

<div
	class={cn(
		'rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-card-foreground)] shadow-sm',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
