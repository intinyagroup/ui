<script lang="ts">
	import { cn } from '../../utils.js';

	export type Reaction = {
		id: string;
		emoji: string;
		count: number;
		label?: string;
	};

	let {
		reactions,
		onReact,
		selected,
		allowDeselect = true,
		class: className
	}: {
		reactions: Reaction[];
		onReact?: (id: string | null) => void;
		/** Currently selected reaction id. */
		selected?: string | null;
		allowDeselect?: boolean;
		class?: string;
	} = $props();
</script>

<div class={cn('inline-flex flex-wrap items-center gap-1.5', className)} role="group" aria-label="Reactions">
	{#each reactions as reaction (reaction.id)}
		<button
			type="button"
			class={cn(
				'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
				reaction.id === selected
					? 'border-[var(--ui-primary)]/40 bg-[var(--ui-primary)]/10 text-[var(--ui-primary)] shadow-sm'
					: 'border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] hover:border-[var(--ui-primary)]/40 hover:bg-[var(--ui-muted)]'
			)}
			aria-pressed={reaction.id === selected}
			aria-label={reaction.label ? `${reaction.label}${reaction.count ? `, ${reaction.count}` : ''}` : undefined}
			title={reaction.label}
			onclick={() => {
				const next = reaction.id === selected && allowDeselect ? null : reaction.id;
				onReact?.(next);
			}}
		>
			<span class="text-base leading-none" aria-hidden="true">{reaction.emoji}</span>
			{#if reaction.count > 0}
				<span
					class={cn(
						'tabular-nums',
						reaction.id === selected ? 'font-bold' : 'text-[var(--ui-muted-foreground)]'
					)}
				>
					{reaction.count}
				</span>
			{/if}
		</button>
	{/each}
</div>