<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    forceMount = false,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    forceMount?: boolean;
    [key: string]: any;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="command-separator"
  role="separator"
  class={cn("-mx-1 h-px bg-border", className)}
  {...restProps}
/>
