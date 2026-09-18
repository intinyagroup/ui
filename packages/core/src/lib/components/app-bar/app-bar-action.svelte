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
    size = "icon-sm",
    shortcut,
    title,
    disabled = false,
    children,
    ...restProps
  }: WithElementRef<HTMLButtonAttributes> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    shortcut?: string;
    title?: string;
    children?: Snippet;
  } = $props();
</script>

<button
  bind:this={ref}
  type="button"
  data-slot="app-bar-action"
  title={title ?? (shortcut ? `${shortcut}` : undefined)}
  {disabled}
  class={cn(buttonVariants({ variant, size }), "shrink-0", className)}
  {...restProps}
>
  {@render children?.()}
  {#if shortcut}
    <kbd data-slot="app-bar-shortcut" class="hidden sr-only">{shortcut}</kbd>
  {/if}
</button>
