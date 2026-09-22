<script lang="ts">
  import type { Snippet } from "svelte";
  let {
    title = "Inspector",
    description,
    children,
    class: className,
  }: {
    title?: string;
    description?: string;
    children?: Snippet;
    class?: string;
  } = $props();
</script>

<aside
  class={`flex h-full w-80 flex-col border-l border-border bg-card text-card-foreground ${className ?? ""}`}
  data-slot="inspector-shell"
  aria-label={title}
>
  <header class="shrink-0 border-b border-border px-4 py-3">
    <h2 class="text-sm font-semibold">{title}</h2>
    {#if description}<p class="mt-1 text-xs text-muted-foreground">
        {description}
      </p>{/if}
  </header>
  <div class="min-h-0 flex-1 overflow-y-auto p-4">
    {@render children?.()}
  </div>
</aside>
