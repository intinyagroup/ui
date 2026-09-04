<script lang="ts">
  import { cn } from '../../utils.js';

  let {
    items = $bindable([]),
    itemHeight = 48,
    overscan = 5,
    class: className,
    children,
    onEndReached
  }: {
    items?: any[];
    itemHeight?: number;
    overscan?: number;
    class?: string;
    children?: (args: { item: any; index: number }) => any;
    onEndReached?: () => void;
  } = $props();

  let scrollTop = $state(0);
  let viewportHeight = $state(0);
  let viewport = $state<HTMLDivElement | null>(null);

  const totalHeight = $derived(items.length * itemHeight);
  const startIndex = $derived(Math.max(0, Math.floor(scrollTop / itemHeight) - overscan));
  const visibleCount = $derived(Math.ceil(viewportHeight / itemHeight) + overscan * 2);
  const endIndex = $derived(Math.min(items.length, startIndex + visibleCount));
  const visibleItems = $derived(items.slice(startIndex, endIndex));

  $effect(() => {
    if (viewport) {
      viewportHeight = viewport.clientHeight;
    }
  });

  function handleScroll() {
    if (!viewport) return;
    scrollTop = viewport.scrollTop;
    if (scrollTop + viewport.clientHeight >= viewport.scrollHeight - 100) {
      onEndReached?.();
    }
  }
</script>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    bind:this={viewport}
    onscroll={handleScroll}
    tabindex="0"
    role="list"
    aria-label="Virtual list"
    class={cn('overflow-y-auto', className)}
    style="height: 100%;"
  >
    <div style="height: {totalHeight}px; position: relative;">
      {#each visibleItems as item, i (item.id ?? i)}
        <div
          role="listitem"
          style="position: absolute; top: {(startIndex + i) * itemHeight}px; left: 0; right: 0; height: {itemHeight}px;"
        >
          {@render children?.({ item, index: startIndex + i })}
        </div>
      {/each}
    </div>
  </div>
