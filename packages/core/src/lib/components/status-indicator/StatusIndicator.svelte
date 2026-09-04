<script lang="ts">
	import { cn } from '../../utils.js';

	type Status = 'online' | 'offline' | 'away' | 'busy' | 'custom';

	let {
		status = 'online',
		label,
		customColor = '#22c55e',
		size = 'md',
		class: className
	}: {
		status?: Status;
		/** Accessible name when no visible label is rendered. */
		label?: string;
		/** Dot color for `status="custom"`. */
		customColor?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	} = $props();

	const dot = {
		sm: 'h-2 w-2',
		md: 'h-2.5 w-2.5',
		lg: 'h-3.5 w-3.5'
	} as const;

	const colors: Record<Status, string> = {
		online: 'bg-[var(--ui-success)]',
		offline: 'bg-[var(--ui-muted-foreground)]/50',
		away: 'bg-[var(--ui-warning)]',
		busy: 'bg-[var(--ui-destructive)]',
		custom: ''
	};
</script>

<span class={cn('inline-flex items-center gap-2', className)} role="img" aria-label={label ?? status}>
	<span
		class={cn('inline-block shrink-0 rounded-full', dot[size], colors[status])}
		style={status === 'custom' ? `background-color: ${customColor};` : undefined}
		aria-hidden="true"
	></span>
	{#if label}
		<span class="text-sm font-medium text-[var(--ui-foreground)]">{label}</span>
	{/if}
</span>