import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const DND_KEY = Symbol('intinya-dnd');

export type DragState = {
  activeId: string | null;
  overId: string | null;
  offset: { x: number; y: number };
  /** Viewport rect of the draggable element at drag start (for overlay positioning). */
  startRect: { left: number; top: number } | null;
  data: Record<string, unknown>;
};

export type DragCallbacks = {
  onDragStart?: (state: DragState) => void;
  onDragMove?: (state: DragState) => void;
  onDragEnd?: (state: DragState) => void;
  onDragCancel?: (state: DragState) => void;
};

export type DndContextValue = {
  state: Writable<DragState>;
  callbacks: DragCallbacks;
  startDrag: (id: string, data: Record<string, unknown>, e: PointerEvent) => void;
  moveDrag: (e: PointerEvent) => void;
  endDrag: () => void;
  cancelDrag: () => void;
  registerDroppable: (id: string, el: HTMLElement) => void;
  unregisterDroppable: (id: string) => void;
  /** Sortables additionally register their index so a drop can resolve overId -> target index. */
  registerSortableIndex: (id: string, index: number) => void;
  unregisterSortableIndex: (id: string) => void;
  getSortableIndex: (id: string) => number | undefined;
};

const EMPTY_OFFSET = { x: 0, y: 0 };

function initialDragState(): DragState {
  return { activeId: null, overId: null, offset: { ...EMPTY_OFFSET }, startRect: null, data: {} };
}

export function setDndContext(callbacks: DragCallbacks = {}): DndContextValue {
  const state = writable<DragState>(initialDragState());
  // Mirror of the store value: Writable has no getState(), so the closures
  // read this instead of re-subscribing.
  let current: DragState = initialDragState();

  const droppables: Map<string, HTMLElement> = new Map();
  const sortableIndexes: Map<string, number> = new Map();
  let startPointer: { x: number; y: number } | null = null;

  function publish(next: DragState): void {
    current = next;
    state.set(next);
  }

  function hitTest(x: number, y: number): string | null {
    for (const [id, el] of droppables) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return id;
      }
    }
    return null;
  }

  function startDrag(id: string, data: Record<string, unknown>, e: PointerEvent): void {
    if (startPointer) return; // already dragging
    startPointer = { x: e.clientX, y: e.clientY };

    const target = e.currentTarget as HTMLElement | null;
    const rect = target?.getBoundingClientRect();

    publish({
      activeId: id,
      overId: hitTest(e.clientX, e.clientY),
      offset: { ...EMPTY_OFFSET },
      startRect: rect ? { left: rect.left, top: rect.top } : null,
      data
    });
    callbacks.onDragStart?.(current);
  }

  function moveDrag(e: PointerEvent): void {
    if (!startPointer) return;
    publish({
      ...current,
      offset: { x: e.clientX - startPointer.x, y: e.clientY - startPointer.y },
      overId: hitTest(e.clientX, e.clientY)
    });
    callbacks.onDragMove?.(current);
  }

  function clearDrag(): DragState {
    const final = current;
    publish(initialDragState());
    startPointer = null;
    return final;
  }

  function endDrag(): void {
    if (!startPointer) return;
    callbacks.onDragEnd?.(clearDrag());
  }

  function cancelDrag(): void {
    if (!startPointer) return;
    callbacks.onDragCancel?.(clearDrag());
  }

  const value: DndContextValue = {
    state,
    callbacks,
    startDrag,
    moveDrag,
    endDrag,
    cancelDrag,
    registerDroppable: (id, el) => droppables.set(id, el),
    unregisterDroppable: (id) => droppables.delete(id),
    registerSortableIndex: (id, index) => sortableIndexes.set(id, index),
    unregisterSortableIndex: (id) => sortableIndexes.delete(id),
    getSortableIndex: (id) => sortableIndexes.get(id)
  };

  setContext(DND_KEY, value);
  return value;
}

export function getDndContext(): DndContextValue {
  const ctx = getContext<DndContextValue>(DND_KEY);
  if (!ctx) {
    throw new Error(
      'getDndContext() called outside of <DndContext>. Wrap draggables/droppables in a DndContext provider.'
    );
  }
  return ctx;
}
