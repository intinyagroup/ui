<script lang="ts">
  import { Pagination as ArkPagination } from "@ark-ui/svelte/pagination";
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "../button/index.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof ArkPagination.PrevTrigger> = $props();
</script>

{#snippet Fallback()}
  <ChevronLeftIcon class={cn("size-4", className)} />
  <span>Previous</span>
{/snippet}

<ArkPagination.PrevTrigger
  bind:ref
  aria-label="Go to previous page"
  class={cn(buttonVariants({ variant: "ghost" }), "pl-1.5!", className)}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    {@render Fallback()}
  {/if}
</ArkPagination.PrevTrigger>
