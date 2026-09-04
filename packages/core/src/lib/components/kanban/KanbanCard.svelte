<script lang="ts">
	import { cn } from '../../utils.js';
	import { getKanbanContext, type KanbanCard } from './KanbanBoard.svelte';

	let {
		card,
		draggable = true,
		class: className,
	}: {
		card: KanbanCard;
		draggable?: boolean;
		class?: string;
	} = $props();

	const { draggedCardId, startDrag, endDrag } = getKanbanContext();

	const isDragged = $derived(draggedCardId() === card.id);

	function handleDragStart(e: DragEvent) {
		if (!draggable) return;
		e.dataTransfer!.effectAllowed = 'move';
		e.dataTransfer!.setData('text/plain', card.id);
		e.dataTransfer!.setDragImage(e.currentTarget as Element, 20, 20);
		startDrag(card.id);
	}

	function handleDragEnd() {
		endDrag();
	}
</script>

<div
	class={cn(
		'cursor-grab touch-manipulation select-none rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] p-3.5 shadow-sm transition-all duration-150',
		'hover:border-[var(--ui-border)]/80 hover:shadow-md',
		'active:cursor-grabbing',
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-ring)]',
		isDragged && 'opacity-40',
		!draggable && 'cursor-default',
		className
	)}
	draggable={draggable}
	tabindex={draggable ? 0 : undefined}
	role={draggable ? 'button' : undefined}
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	onkeydown={(e) => {
		if (!draggable) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			(e.currentTarget as HTMLElement).click();
		}
	}}
>
	{#if card.title}
		<p class="text-sm font-medium leading-snug text-[var(--ui-foreground)]">
			{card.title}
		</p>
	{/if}

	{#if card.description}
		<p class="mt-1.5 text-xs leading-relaxed text-[var(--ui-muted-foreground)]">
			{card.description}
		</p>
	{/if}

	{#if card.tags && card.tags.length > 0}
		<div class="mt-2.5 flex flex-wrap gap-1.5">
			{#each card.tags as tag (tag)}
				<span
					class="rounded-full bg-[var(--ui-secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--ui-secondary-foreground)]"
				>
					{tag}
				</span>
			{/each}
		</div>
	{/if}
</div>
