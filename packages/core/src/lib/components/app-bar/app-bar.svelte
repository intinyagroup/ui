<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  export type AppBarPosition = "static" | "sticky" | "fixed";
  export type AppBarVariant = "default" | "flat" | "bordered" | "elevated";

  let {
    ref = $bindable(null),
    class: className,
    position = "sticky",
    variant = "default",
    dense = false,
    leading,
    title,
    actions,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> & {
    position?: AppBarPosition;
    variant?: AppBarVariant;
    dense?: boolean;
    leading?: Snippet;
    title?: Snippet | string;
    actions?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<header
  bind:this={ref}
  data-slot="app-bar"
  data-position={position}
  data-variant={variant}
  data-dense={dense ? "true" : undefined}
  class={cn(
    "z-40 w-full bg-background/95 backdrop-blur-md transition-all text-foreground",
    position === "sticky" && "sticky top-0",
    position === "fixed" && "fixed top-0 inset-x-0",
    position === "static" && "relative",
    variant === "default" && "border-b border-border/80",
    variant === "bordered" && "border-b border-border",
    variant === "elevated" && "shadow-xs border-b border-border/40",
    variant === "flat" && "border-none shadow-none",
    className,
  )}
  {...restProps}
>
  <div
    class={cn(
      "flex items-center justify-between gap-2 px-4",
      dense ? "h-12" : "h-14 sm:h-16",
    )}
  >
    {#if children}
      {@render children()}
    {:else}
      <div class="flex items-center gap-2 min-w-0">
        {#if leading}
          <div data-slot="app-bar-leading" class="shrink-0 flex items-center">
            {@render leading()}
          </div>
        {/if}
        {#if title}
          <div
            data-slot="app-bar-title"
            class="truncate font-semibold text-base sm:text-lg"
          >
            {#if typeof title === "string"}
              {title}
            {:else if title}
              {@render (title as Snippet)()}
            {/if}
          </div>
        {/if}
      </div>
      {#if actions}
        <div
          data-slot="app-bar-actions"
          class="ml-auto shrink-0 flex items-center gap-1"
        >
          {@render actions()}
        </div>
      {/if}
    {/if}
  </div>
</header>
