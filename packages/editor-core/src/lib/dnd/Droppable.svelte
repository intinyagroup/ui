<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDndContext } from './dnd-context.svelte.js';

  let {
    id,
    class: className,
    children
  }: {
    id: string;
    class?: string;
    children?: Snippet;
  } = $props();

  const { state: dragState, registerDroppable, unregisterDroppable } = getDndContext();

  let element: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!element) return;
    registerDroppable(id, element);
    return () => unregisterDroppable(id);
  });

  const isOver = $derived($dragState.overId === id);
</script>

<div
  bind:this={element}
  class={className}
  class:ring-2={isOver}
  class:ring-[var(--ui-primary)]={isOver}
  class:ring-opacity-50={isOver}
>
  {@render children?.()}
</div>