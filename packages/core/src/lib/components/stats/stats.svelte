<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		stats
	}: {
		ref?: HTMLElement | null;
		class?: string;
		stats: { value: string; label: string }[];
	} = $props();
</script>

<div bind:this={ref} class={cn('grid grid-cols-2 gap-6 md:grid-cols-4', className)}>
	{#each stats as stat}
		<div class="flex flex-col items-center gap-1 text-center">
			<span class="text-3xl font-bold tracking-tight text-[var(--ui-foreground)]">{stat.value}</span>
			<span class="text-sm text-[var(--ui-muted-foreground)]">{stat.label}</span>
		</div>
	{/each}
</div>
