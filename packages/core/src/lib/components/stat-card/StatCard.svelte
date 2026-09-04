<script lang="ts">
  import { cn } from '../../utils.js';
  import { TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  let {
    label = '',
    value = '',
    change = 0,
    changeLabel = '',
    icon,
    class: className,
  }: {
    label?: string;
    value?: string | number;
    change?: number;
    changeLabel?: string;
    icon?: any;
    class?: string;
  } = $props();

  const changeColor = $derived(change > 0 ? 'text-[var(--ui-success)]' : change < 0 ? 'text-[var(--ui-destructive)]' : 'text-[var(--ui-muted-foreground)]');
</script>

<div class={cn('p-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)]', className)}>
  <div class="flex items-start justify-between mb-2">
    <span class="text-sm text-[var(--ui-muted-foreground)]">{label}</span>
    {#if icon}
      <svelte:component this={icon} class="size-5 text-[var(--ui-muted-foreground)]" />
    {/if}
  </div>
  <div class="text-2xl font-bold text-[var(--ui-foreground)] mb-1">{value}</div>
  {#if change !== 0}
    <div class={cn('flex items-center gap-1 text-xs', changeColor)}>
      {#if change > 0}
        <TrendingUp class="size-3" />
      {:else if change < 0}
        <TrendingDown class="size-3" />
      {:else}
        <Minus class="size-3" />
      {/if}
      <span>{change > 0 ? '+' : ''}{change}%</span>
      {#if changeLabel}
        <span class="text-[var(--ui-muted-foreground)]">{changeLabel}</span>
      {/if}
    </div>
  {/if}
</div>
