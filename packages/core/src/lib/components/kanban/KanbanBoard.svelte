<script lang="ts" module>
	import { getContext } from 'svelte';

	export type KanbanCard = {
		id: string;
		title: string;
		description?: string;
		tags?: string[];
	};

	export type KanbanColumn = {
		id: string;
		title: string;
		cards: KanbanCard[];
		accent?: string;
	};

	export type KanbanContext = {
		columns: KanbanColumn[];
		draggedCardId: () => string | null;
		isDragging: () => boolean;
		startDrag: (cardId: string) => void;
		endDrag: () => void;
		moveCard: (
			cardId: string,
			fromColumnId: string,
			toColumnId: string,
			toIndex: number
		) => void;
	};

	export const KANBAN_CONTEXT_KEY = 'intinya-kanban';

	export function getKanbanContext() {
		return getContext<KanbanContext>(KANBAN_CONTEXT_KEY);
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { cn } from '../../utils.js';
	import KanbanColumnView from './KanbanColumn.svelte';

	let {
		columns = $bindable([]),
		class: className,
		onCardMove,
	}: {
		columns: KanbanColumn[];
		class?: string;
		onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, index: number) => void;
	} = $props();

	let draggedCardId = $state<string | null>(null);
	let isDragging = $derived(draggedCardId !== null);

	setContext<KanbanContext>(KANBAN_CONTEXT_KEY, {
		get columns() {
			return columns;
		},
		draggedCardId: () => draggedCardId,
		isDragging: () => isDragging,
		startDrag: (cardId) => {
			draggedCardId = cardId;
		},
		endDrag: () => {
			draggedCardId = null;
		},
		moveCard,
	});

	function moveCard(
		cardId: string,
		fromColumnId: string,
		toColumnId: string,
		toIndex: number
	) {
		const fromColumn = columns.find((c) => c.id === fromColumnId);
		const toColumn = columns.find((c) => c.id === toColumnId);
		if (!fromColumn || !toColumn) return;

		const fromIndex = fromColumn.cards.findIndex((c) => c.id === cardId);
		if (fromIndex === -1) return;

		if (fromColumnId === toColumnId && fromIndex === toIndex) return;

		const [card] = fromColumn.cards.splice(fromIndex, 1);
		const insertIndex = Math.min(toIndex, toColumn.cards.length);
		toColumn.cards.splice(insertIndex, 0, card);

		onCardMove?.(cardId, fromColumnId, toColumnId, insertIndex);
	}
</script>

<div
	class={cn(
		'flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]',
		className
	)}
>
	{#each columns as column (column.id)}
		<KanbanColumnView {column} />
	{/each}
</div>
