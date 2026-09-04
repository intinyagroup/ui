<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		viewers,
		label = 'LIVE',
		pulsing = true,
		class: className
	}: {
		/** Optional viewer count shown next to the badge. */
		viewers?: number;
		label?: string;
		pulsing?: boolean;
		class?: string;
	} = $props();
</script>

<span
	class={cn('inline-flex items-center gap-1.5', className)}
	role="status"
	aria-label={viewers !== undefined ? `${label}, ${viewers} watching` : label}
>
	<span class="relative flex h-2.5 w-2.5" aria-hidden="true">
		{#if pulsing}
			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ui-destructive)] opacity-75"
			></span>
		{/if}
		<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--ui-destructive)]"></span>
	</span>
	<span class="text-xs font-bold uppercase tracking-wider text-[var(--ui-foreground)]">{label}</span>
	{#if viewers !== undefined}
		<span class="text-xs font-medium tabular-nums text-[var(--ui-muted-foreground)]">
			{viewers.toLocaleString()} watching
		</span>
	{/if}
</span>