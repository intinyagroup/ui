<script lang="ts">
  import { cn } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  let {
    size = 20,
    color = 'var(--ui-border)',
    visible = true,
    class: className
  }: {
    size?: number;
    color?: string;
    visible?: boolean;
    class?: string;
  } = $props();
</script>

{#if visible}
  <div
    class={twMerge('absolute inset-0 pointer-events-none', className)}
    style="background-image:
      linear-gradient({color} 1px, transparent 1px),
      linear-gradient(90deg, {color} 1px, transparent 1px);
      background-size: {size}px {size}px;"
  />
{/if}
