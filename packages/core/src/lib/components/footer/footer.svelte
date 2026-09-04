<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children
	}: {
		ref?: HTMLElement | null;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<footer bind:this={ref} class={cn('border-t border-[var(--ui-border)] bg-[var(--ui-card)] px-6 py-12', className)}>
	{@render children?.()}
</footer>
