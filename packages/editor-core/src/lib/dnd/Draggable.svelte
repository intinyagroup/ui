<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDndContext } from './dnd-context.svelte.js';

  let {
    id,
    data = {},
    disabled = false,
    class: className,
    children
  }: {
    id: string;
    data?: Record<string, unknown>;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
  } = $props();

  const { state: dragState, startDrag, moveDrag, endDrag, cancelDrag } = getDndContext();

  let element: HTMLDivElement | undefined = $state();

  const isActive = $derived($dragState.activeId === id);
  const style = $derived(
    isActive ? `transform: translate3d(${$dragState.offset.x}px, ${$dragState.offset.y}px, 0)` : undefined
  );

  function onPointerDown(e: PointerEvent) {
    if (disabled || e.button !== 0) return;
    element?.setPointerCapture(e.pointerId);
    startDrag(id, { ...data, type: 'draggable' }, e);
  }

  function onPointerMove(e: PointerEvent) {
    if (!$dragState.activeId) return;
    e.preventDefault();
    moveDrag(e);
  }

  function onPointerUp(e: PointerEvent) {
    if (!$dragState.activeId) return;
    element?.releasePointerCapture(e.pointerId);
    endDrag();
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
  class:opacity-50={isActive}
  class:cursor-grabbing={isActive}
  class:cursor-grab={!isActive}
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-grabbed={isActive}
  style:touch-action="none"
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointercancel={onPointerCancel}
>
  {@render children?.()}
</div>