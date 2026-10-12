<script lang="ts">
  import { Pagination as ArkPagination } from "@ark-ui/svelte/pagination";
  import {
    buttonVariants,
    type ButtonSize,
  } from "$lib/components/button/index.js";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    size = "icon",
    isActive,
    page,
    value: _ignoredValue,
    children,
    ...restProps
  }: ComponentProps<typeof ArkPagination.Item> & {
    size?: ButtonSize;
    isActive: boolean;
    page: { value: number; href: string };
  } = $props();
</script>

{#snippet Fallback()}
  {page.value}
{/snippet}

<ArkPagination.Item
  bind:ref
  value={page.value}
  aria-current={isActive ? "page" : undefined}
  data-slot="pagination-link"
  data-active={isActive}
  data-size={size}
  class={cn(
    buttonVariants({ size, variant: isActive ? "outline" : "ghost" }),
    "cn-pagination-link",
    className,
  )}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    {@render Fallback()}
  {/if}
</ArkPagination.Item>
