<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils.js';

  let {
    variant = 'default',
    size = 'default',
    class: className,
    children,
  }: {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'default' | 'lg';
    class?: string;
    children?: Snippet;
  } = $props();

  const variantStyles: Record<string, string> = {
    default: 'bg-[var(--ui-primary)]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'size-3',
    default: 'size-[18px]',
    lg: 'size-6',
  };
</script>

<span
  class={cn(
    'inline-flex items-center justify-center rounded-full border-2 border-[var(--ui-background)] shrink-0',
    variantStyles[variant],
    sizeStyles[size],
    className
  )}
>
  {#if children}
    {@render children()}
  {/if}
</span>
