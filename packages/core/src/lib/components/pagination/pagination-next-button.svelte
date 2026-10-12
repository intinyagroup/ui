<script lang="ts">
  import { Pagination as ArkPagination } from "@ark-ui/svelte/pagination";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "../button/index.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof ArkPagination.NextTrigger> = $props();
</script>

{#snippet Fallback()}
  <span>Next</span>
  <ChevronRightIcon class={cn("size-4", className)} />
{/snippet}

<ArkPagination.NextTrigger
  bind:ref
  aria-label="Go to next page"
  class={cn(buttonVariants({ variant: "ghost" }), "pr-1.5!", className)}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    {@render Fallback()}
  {/if}
</ArkPagination.NextTrigger>
