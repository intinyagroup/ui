<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    progress,
    children,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    progress?: number;
    children?: Snippet;
    [key: string]: any;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="command-loading"
  role="status"
  aria-busy="true"
  {...restProps}
>
  {@render children?.()}
</div>
