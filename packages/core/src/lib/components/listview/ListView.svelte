<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';

	let {
		inset = true,
		class: className,
		children
	}: {
		/** Group the list in a rounded, bordered card (mobile settings-list style). */
		inset?: boolean;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<ul
	role="list"
	class={cn(
		'divide-y divide-[var(--ui-border)]',
		inset && 'overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-sm',
		className
	)}
>
	{@render children()}
</ul>
