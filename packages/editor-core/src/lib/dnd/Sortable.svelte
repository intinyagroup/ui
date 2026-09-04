<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDndContext } from './dnd-context.svelte.js';

  let {
    id,
    index,
    class: className,
    onReorder,
    children
  }: {
    id: string;
    index: number;
    class?: string;
    onReorder?: (fromIndex: number, toIndex: number) => void;
    children?: Snippet;
  } = $props();

  const {
    state: dragState,
    startDrag,
    moveDrag,
    endDrag,
    cancelDrag,
    registerDroppable,
    unregisterDroppable,
    registerSortableIndex,
    unregisterSortableIndex,
    getSortableIndex
  } = getDndContext();

  let element: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!element) return;
    registerDroppable(id, element);
    registerSortableIndex(id, index);
    return () => {
      unregisterDroppable(id);
      unregisterSortableIndex(id);
    };
  });

  const isActive = $derived($dragState.activeId === id);

  // When a dragging sibling hovers over this item, shift it out of the way by
  // one slot; direction comes from whether the dragged item is above or below.
  const shift = $derived.by(() => {
    if (isActive || $dragState.overId !== id || !element) return 0;
    const fromIndex = $dragState.data.index;
    const gap = typeof fromIndex === 'number' ? fromIndex - index : 0;
    return gap > 0 ? -element.offsetHeight : element.offsetHeight;
  });

  const style = $derived(`
    transform: translate3d(0, ${shift}px, 0);
    transition: transform 0.2s ease;
    z-index: ${isActive ? 10 : undefined};
  `);

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    element?.setPointerCapture(e.pointerId);
    startDrag(id, { index, type: 'sortable' }, e);
  }

  function onPointerMove(e: PointerEvent) {
    if (!$dragState.activeId) return;
    e.preventDefault();
    moveDrag(e);
  }

  function onPointerUp(e: PointerEvent) {
    if (!$dragState.activeId) return;
    element?.releasePointerCapture(e.pointerId);
    const { overId, data } = $dragState;
    endDrag();
    const fromIndex = data.index;
    const toIndex = overId ? getSortableIndex(overId) : undefined;
    if (typeof fromIndex === 'number' && typeof toIndex === 'number' && fromIndex !== toIndex) {
      onReorder?.(fromIndex, toIndex);
    }
  }

  function onPointerCancel(e: PointerEvent) {
    if (!$dragState.activeId) return;
    element?.releasePointerCapture(e.pointerId);
    cancelDrag();
  }
</script>

<div
  bind:this={element}
  {style}
  class={className}
  class:opacity-60={isActive}
  role="listitem"
  aria-grabbed={isActive}
  style:touch-action="none"
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointercancel={onPointerCancel}
>
  {@render children?.()}
</div>