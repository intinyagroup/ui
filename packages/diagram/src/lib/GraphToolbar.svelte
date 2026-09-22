<script lang="ts">
  import type { Snippet } from "svelte";
  let { children, class: className }: { children?: Snippet; class?: string } =
    $props();
</script>

<div
  class={`pointer-events-auto absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg border border-border bg-card/95 p-1 shadow-lg backdrop-blur-xl ${className ?? ""}`}
  data-slot="graph-toolbar"
>
  {@render children?.()}
</div>
