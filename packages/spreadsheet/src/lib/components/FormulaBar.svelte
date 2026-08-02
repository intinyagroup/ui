<script lang="ts">
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    cellId,
    value,
    onValueChange,
  }: {
    cellId: string;
    value: string;
    onValueChange: (value: string) => void;
  } = $props();

  let inputValue = $state(value);

  $effect(() => {
    inputValue = value;
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onValueChange(inputValue);
    }
    if (e.key === 'Escape') {
      inputValue = value;
    }
  }

  function handleBlur() {
    if (inputValue !== value) {
      onValueChange(inputValue);
    }
  }
</script>

<div class="flex items-center gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)] px-3 py-1.5">
  <span class="text-xs font-semibold text-[var(--ui-muted-foreground)] min-w-[48px]">
    {cellId}
  </span>
  <div class="h-4 w-px bg-[var(--ui-border)]"></div>
  <input
    type="text"
    bind:value={inputValue}
    onkeydown={handleKeydown}
    onblur={handleBlur}
    class="flex-1 h-7 px-2 rounded-md border border-[var(--ui-input)] bg-[var(--ui-background)] text-sm text-[var(--ui-foreground)] font-mono outline-none focus:border-[var(--ui-primary)]/50 focus:ring-1 focus:ring-[var(--ui-ring)]/20"
    placeholder="Enter value..."
  />
</div>
