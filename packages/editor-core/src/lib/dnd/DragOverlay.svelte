<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDndContext } from './dnd-context.svelte.js';

  let {
    children
  }: {
    children?: Snippet;
  } = $props();

  const { state: dragState } = getDndContext();

  const active = $derived($dragState.activeId !== null);

  let container: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!active || !container) return;
    document.body.appendChild(container);
    return () => {
      container?.remove();
    };
  });

  const left = $derived(($dragState.startRect?.left ?? 0) + $dragState.offset.x);
  const top = $derived(($dragState.startRect?.top ?? 0) + $dragState.offset.y);
  const style = $derived(
    `position: fixed; left: ${left}px; top: ${top}px; pointer-events: none; opacity: 0.8;`
  );
</script>

{#if active}
  <div bind:this={container} style="position: fixed; inset: 0; z-index: 50; pointer-events: none; overflow: hidden;">
    <div {style}>
      {@render children?.()}
    </div>
  </div>
{/if}