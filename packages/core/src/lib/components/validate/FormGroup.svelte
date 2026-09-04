<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		legend,
		class: className,
		children
	}: {
		legend?: string;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<fieldset class={cn('grid gap-4 rounded-xl border border-[var(--ui-border)] p-4', className)}>
	{#if legend}
		<legend class="px-2 text-sm font-semibold">{legend}</legend>
	{/if}
	{@render children?.()}
</fieldset>