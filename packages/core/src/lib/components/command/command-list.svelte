<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { getCommandContext } from "./command-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    [key: string]: any;
  } = $props();

  const ctx = getCommandContext();

  $effect(() => {
    if (ref) ctx.setViewportNode(ref);
  });
</script>

<div
  bind:this={ref}
  data-slot="command-list"
  role="listbox"
  class={cn(
    "no-scrollbar max-h-72 scroll-py-1 outline-none overflow-x-hidden overflow-y-auto",
    className,
  )}
  {...restProps}
/>
