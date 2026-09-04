<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setDndContext, type DragCallbacks } from './dnd-context.svelte.js';

  let {
    children,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel
  }: {
    children?: Snippet;
    onDragStart?: DragCallbacks['onDragStart'];
    onDragMove?: DragCallbacks['onDragMove'];
    onDragEnd?: DragCallbacks['onDragEnd'];
    onDragCancel?: DragCallbacks['onDragCancel'];
  } = $props();

  const callbacks = {
    get onDragStart() {
      return onDragStart;
    },
    get onDragMove() {
      return onDragMove;
    },
    get onDragEnd() {
      return onDragEnd;
    },
    get onDragCancel() {
      return onDragCancel;
    }
  };

  setDndContext(callbacks);
</script>

{@render children?.()}