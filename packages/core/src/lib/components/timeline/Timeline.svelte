<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils.js';

  type TimelineItem = {
    id: string;
    title: string;
    description?: string;
    timestamp?: string;
    icon?: any;
    color?: 'default' | 'success' | 'warning' | 'error' | 'info';
    content?: Snippet;
  };

  let {
    items = [],
    orientation = 'vertical',
    class: className,
    itemClass,
  }: {
    items: TimelineItem[];
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    itemClass?: string;
  } = $props();

  const colorMap: Record<string, string> = {
    default: 'bg-[var(--ui-muted)]',
    success: 'bg-[var(--ui-success)]',
    warning: 'bg-[var(--ui-warning)]',
    error: 'bg-[var(--ui-destructive)]',
    info: 'bg-[var(--ui-info)]',
  };

  const ringColorMap: Record<string, string> = {
    default: 'ring-[var(--ui-muted)]/20',
    success: 'ring-[var(--ui-success)]/20',
    warning: 'ring-[var(--ui-warning)]/20',
    error: 'ring-[var(--ui-destructive)]/20',
    info: 'ring-[var(--ui-info)]/20',
  };
</script>

<div class={cn(
  'relative',
  orientation === 'vertical' ? 'pl-8' : 'flex items-start gap-6 overflow-x-auto pb-4',
  className
)}>
  {#each items as item, index (item.id)}
    {@const color = item.color ?? 'default'}

    <div class={cn(
      'relative',
      orientation === 'vertical' ? 'pb-8 last:pb-0' : 'flex flex-col items-center min-w-[200px]',
      itemClass
    )}>
      {#if orientation === 'vertical'}
        <!-- Connector line -->
        {#if index < items.length - 1}
          <div class="absolute left-[-20px] top-8 w-0.5 h-full {colorMap[color]} opacity-20"></div>
        {/if}

        <!-- Dot -->
        <div class="absolute left-[-28px] top-1 flex items-center justify-center size-4 rounded-full ring-4 {colorMap[color]} {ringColorMap[color]}">
          {#if item.icon}
            <item.icon class="size-2 text-white" />
          {/if}
        </div>

        <!-- Content -->
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-semibold text-[var(--ui-foreground)]">{item.title}</h4>
            {#if item.timestamp}
              <span class="text-xs text-[var(--ui-muted-foreground)]">{item.timestamp}</span>
            {/if}
          </div>
          {#if item.description}
            <p class="text-sm text-[var(--ui-muted-foreground)] mt-0.5">{item.description}</p>
          {/if}
          {#if item.content}
            <div class="mt-2">
              {@render item.content()}
            </div>
          {/if}
        </div>
      {:else}
        <!-- Horizontal layout -->
        <div class="flex flex-col items-center">
          <!-- Dot -->
          <div class="flex items-center justify-center size-4 rounded-full ring-4 {colorMap[color]} {ringColorMap[color]}">
            {#if item.icon}
              <item.icon class="size-2 text-white" />
            {/if}
          </div>

          <!-- Connector line -->
          {#if index < items.length - 1}
            <div class="w-full h-0.5 mt-2 {colorMap[color]} opacity-20"></div>
          {/if}
        </div>

        <div class="text-center mt-2">
          <h4 class="text-sm font-semibold text-[var(--ui-foreground)]">{item.title}</h4>
          {#if item.description}
            <p class="text-xs text-[var(--ui-muted-foreground)] mt-0.5">{item.description}</p>
          {/if}
          {#if item.timestamp}
            <span class="text-[10px] text-[var(--ui-muted-foreground)]">{item.timestamp}</span>
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>
