<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils.js';
  import { getContext } from 'svelte';

  let {
    title,
    description,
    date,
    icon,
    class: className,
    children,
  }: {
    title: string;
    description?: string;
    date?: string;
    icon?: Snippet;
    class?: string;
    children?: Snippet;
  } = $props();

  const { alternating } = getContext<{ alternating: boolean }>('timeline');
</script>

<div
  class={cn(
    'relative flex items-start pb-8 last:pb-0',
    alternating && 'timeline-alternate-item',
    className
  )}
  role="listitem"
>
  <!-- Dot — left side for standard, centered for alternating (CSS adjusts position) -->
  <div
    class={cn(
      'timeline-dot absolute z-10 top-0 flex items-center justify-center',
      'size-[18px] rounded-full border-2 border-[var(--ui-background)] bg-[var(--ui-primary)] shrink-0',
      alternating
        ? 'left-1/2 -translate-x-1/2'
        : 'left-[10px]'
    )}
  >
    {#if icon}
      {@render icon()}
    {/if}
  </div>

  <!-- Content -->
  <div
    class={cn(
      'tl-content flex-1',
      alternating ? 'w-1/2 pl-8' : 'pl-12'
    )}
  >
    <div class="tl-title-row flex items-center gap-2">
      <h4 class="text-sm font-semibold text-[var(--ui-foreground)]">{title}</h4>
      {#if date}
        <span class="text-xs text-[var(--ui-muted-foreground)]">{date}</span>
      {/if}
    </div>
    {#if description}
      <p class="text-sm text-[var(--ui-muted-foreground)] mt-0.5">{description}</p>
    {/if}
    {#if children}
      <div class="mt-2">
        {@render children()}
      </div>
    {/if}
  </div>
</div>
