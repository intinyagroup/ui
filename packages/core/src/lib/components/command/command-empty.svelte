<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { getCommandContext } from "./command-context.svelte.js";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    forceMount = false,
    children,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    forceMount?: boolean;
    children?: Snippet;
    [key: string]: any;
  } = $props();

  const ctx = getCommandContext();

  const visible = $derived(
    forceMount || (ctx.search !== "" && ctx.filtered.count === 0),
  );
</script>

{#if visible}
  <div
    bind:this={ref}
    data-slot="command-empty"
    role="option"
    class={cn("py-6 text-center text-sm", className)}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}
