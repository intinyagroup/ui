<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    delayDuration = 0,
    children,
    ...restProps
  }: {
    delayDuration?: number;
    children?: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

{@render children?.()}
