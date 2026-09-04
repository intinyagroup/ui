<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils.js';
	import { getKanbanContext, type KanbanColumn } from './KanbanBoard.svelte';
	import KanbanCardView from './KanbanCard.svelte';

	let {
		column,
		class: className,
		children,
	}: {
		column: KanbanColumn;
		class?: string;
		children?: Snippet;
	} = $props();

	const { columns, draggedCardId, isDragging, moveCard } = getKanbanContext();

	let isDragOver = $state(false);

	const cardCount = $derived(column.cards.length);
	const isDropTarget = $derived(
		isDragging() && isDragOver && draggedCardId() !== null
	);

	function handleDragOver(e: DragEvent) {
		if (!isDragging()) return;
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';
		isDragOver = true;
	}

	function handleDragLeave(e: DragEvent) {
		if (e.currentTarget === e.target) isDragOver = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const cardId = draggedCardId();
		isDragOver = false;
		if (!cardId) return;

		const fromColumnId = columns.find((col) =>
			col.cards.some((c) => c.id === cardId)
		)?.id;
		if (!fromColumnId) return;

		moveCard(cardId, fromColumnId, column.id, column.cards.length);
	}
</script>

<section
	class={cn(
		'flex h-fit w-72 shrink-0 flex-col rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] transition-colors',
		isDropTarget &&
			'border-[var(--ui-primary)] bg-[var(--ui-secondary)] ring-2 ring-[var(--ui-ring)]/40',
		className
	)}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<header class="flex items-center gap-2 px-4 py-3">
		<span
			class="size-2.5 shrink-0 rounded-full"
			style:background={column.accent ?? 'var(--ui-primary)'}
			aria-hidden="true"
		></span>
		<h3 class="truncate text-sm font-semibold text-[var(--ui-foreground)]">
			{column.title}
		</h3>
		<span
			class="ml-auto shrink-0 rounded-full bg-[var(--ui-secondary)] px-2 py-0.5 text-xs font-medium tabular-nums text-[var(--ui-muted-foreground)]"
			aria-label={`${cardCount} cards`}
		>
			{cardCount}
		</span>
	</header>

	<div class="flex flex-col gap-2.5 px-3 pb-3">
		{#each column.cards as card (card.id)}
			<KanbanCardView {card} />
		{/each}
		{@render children?.()}
	</div>
</section>
