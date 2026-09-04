<script lang="ts">
  import { cn } from '../../utils.js';

  let {
    label = '',
    class: className,
  }: {
    label?: string;
    class?: string;
  } = $props();
</script>

<div class={cn('flex items-center gap-3', className)}>
  <div class="flex-1 h-px bg-[var(--ui-border)]"></div>
  {#if label}
    <span class="text-xs text-[var(--ui-muted-foreground)] whitespace-nowrap">{label}</span>
    <div class="flex-1 h-px bg-[var(--ui-border)]"></div>
  {/if}
</div>
