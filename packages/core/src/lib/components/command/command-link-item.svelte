<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { getCommandContext } from "./command-context.svelte.js";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    value: itemValue,
    disabled = false,
    forceMount = false,
    keywords,
    onSelect,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    children?: Snippet;
    value?: string;
    disabled?: boolean;
    forceMount?: boolean;
    keywords?: string[];
    onSelect?: () => void;
    [key: string]: any;
  } = $props();

  const ctx = getCommandContext();
  let uid = $state(0);
  const resolvedValue = $derived(
    itemValue ?? ref?.textContent?.trim() ?? `__cmd_link_${uid}`,
  );

  $effect(() => {
    uid++;
    ctx.registerItem({
      value: resolvedValue,
      keywords,
      el: ref!,
      forceMount,
      disabled,
      onSelect,
    });
    return () => ctx.unregisterItem(resolvedValue);
  });

  const visible = $derived(forceMount || ctx.filtered.items.has(resolvedValue));

  const isSelected = $derived(ctx.value === resolvedValue);
</script>

{#if visible}
  <a
    bind:this={ref}
    data-slot="command-item"
    role="option"
    aria-selected={isSelected}
    data-value={resolvedValue}
    data-checked={isSelected}
    data-disabled={disabled}
    tabindex={-1}
    class={cn(
      "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      className,
    )}
    onpointermove={() => {
      if (!disabled && !ctx.items.get(resolvedValue)?.disabled) {
        const valid = ctx.getValidItems();
        const idx = valid.indexOf(ref!);
        if (idx >= 0) ctx.setSelectedIndex(idx);
      }
    }}
    onclick={() => {
      if (!disabled) {
        onSelect?.();
        ctx.setValue(resolvedValue);
      }
    }}
    {...restProps}
  >
    {@render children?.()}
  </a>
{/if}
