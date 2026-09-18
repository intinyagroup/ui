<script lang="ts">
  import { getContext } from "svelte";
  import { cn } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
  }: {
    ref?: HTMLElement | null;
    class?: string;
  } = $props();

  const drawerState = getContext<{
    get open(): boolean;
    set open(v: boolean);
    get dismissible(): boolean;
  }>("drawer-state");

  function handleClick() {
    if (drawerState.dismissible) drawerState.open = false;
  }
</script>

{#if drawerState.open}
  <div
    bind:this={ref}
    aria-hidden="true"
    data-slot="drawer-overlay"
    class={cn(
      "fixed inset-0 z-50 bg-[var(--ui-overlay-strong)] backdrop-blur-[1px]",
      "transition-opacity duration-300",
      drawerState.open ? "opacity-100" : "opacity-0",
      className,
    )}
    onclick={handleClick}
  ></div>
{/if}
