<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  export type ToolbarOrientation = "horizontal" | "vertical";

  let {
    ref = $bindable(null),
    class: className,
    orientation = "horizontal",
    responsive = false,
    "aria-label": ariaLabel = "Toolbar",
    children,
    onkeydown,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: ToolbarOrientation;
    /** Adds data-responsive hooks for breakpoint-driven collapsing. */
    responsive?: boolean;
    children?: Snippet;
    onkeydown?: (event: KeyboardEvent) => void;
  } = $props();

  function handleKeydown(event: KeyboardEvent) {
    onkeydown?.(event);
    if (event.defaultPrevented) return;
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Home" &&
      event.key !== "End"
    )
      return;

    const target = event.target;
    if (
      !(target instanceof HTMLElement) ||
      !target.matches('[data-slot="toolbar-item"]')
    )
      return;
    const items = Array.from(
      target
        .closest('[data-slot="toolbar"]')
        ?.querySelectorAll<HTMLElement>(
          '[data-slot="toolbar-item"]:not([disabled]):not([aria-disabled="true"])',
        ) ?? [],
    );
    if (!items.length) return;
    const index = items.indexOf(target);
    if (index < 0) return;
    const forward =
      orientation === "horizontal"
        ? event.key === "ArrowRight"
        : event.key === "ArrowDown";
    const backward =
      orientation === "horizontal"
        ? event.key === "ArrowLeft"
        : event.key === "ArrowUp";
    let next = index;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else if (forward) next = (index + 1) % items.length;
    else if (backward) next = (index - 1 + items.length) % items.length;
    else return;
    event.preventDefault();
    items[next]?.focus();
  }
</script>

<div
  bind:this={ref}
  role="toolbar"
  data-slot="toolbar"
  data-orientation={orientation}
  data-responsive={responsive ? "true" : undefined}
  aria-label={ariaLabel}
  aria-orientation={orientation}
  class={cn(
    "flex items-center gap-1",
    orientation === "vertical" && "flex-col",
    className,
  )}
  onkeydown={handleKeydown}
  {...restProps}
>
  {@render children?.()}
</div>
