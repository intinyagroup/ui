<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import {
    buttonVariants,
    type ButtonSize,
    type ButtonVariant,
  } from "../button/Button.svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    variant = "ghost",
    size = "sm",
    pressed = false,
    shortcut,
    title,
    disabled = false,
    children,
    ...restProps
  }: WithElementRef<HTMLButtonAttributes> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    pressed?: boolean;
    shortcut?: string;
    title?: string;
    children?: Snippet;
  } = $props();
</script>

<button
  bind:this={ref}
  type="button"
  data-slot="toolbar-item"
  data-pressed={pressed ? "true" : undefined}
  aria-pressed={pressed}
  title={title ?? (shortcut ? `${shortcut}` : undefined)}
  {disabled}
  class={cn(
    buttonVariants({ variant, size }),
    pressed && "bg-accent text-accent-foreground shadow-xs font-semibold",
    "shrink-0",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  {#if shortcut}
    <kbd data-slot="toolbar-item-shortcut" class="hidden sr-only"
      >{shortcut}</kbd
    >
  {/if}
</button>
