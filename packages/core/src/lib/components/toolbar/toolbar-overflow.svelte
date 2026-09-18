<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import {
    buttonVariants,
    type ButtonSize,
    type ButtonVariant,
  } from "../button/Button.svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    label = "More actions",
    variant = "ghost",
    size = "sm",
    open = $bindable(false),
    children,
    trigger,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    label?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    open?: boolean;
    children?: Snippet;
    trigger?: Snippet;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="toolbar-overflow"
  class={cn("relative inline-flex items-center", className)}
  {...restProps}
>
  {#if trigger}
    {@render trigger()}
  {:else}
    <button
      type="button"
      data-slot="toolbar-item"
      data-toolbar-overflow-trigger="true"
      aria-label={label}
      aria-expanded={open ? "true" : undefined}
      aria-haspopup={children ? "true" : undefined}
      title={label}
      onclick={() => (open = !open)}
      class={cn(buttonVariants({ variant, size }), "shrink-0")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4 pointer-events-none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span class="sr-only">{label}</span>
    </button>
  {/if}

  {#if children && open}
    <div
      data-slot="toolbar-overflow-content"
      class="absolute right-0 top-full mt-1 z-50 min-w-36 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none flex flex-col gap-1"
    >
      {@render children()}
    </div>
  {/if}
</div>
