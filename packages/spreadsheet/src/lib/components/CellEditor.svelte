<script lang="ts">
  import { onMount } from 'svelte';

  let {
    value,
    onCommit,
    onCancel,
  }: {
    value: string;
    onCommit: (newValue: string) => void;
    onCancel: () => void;
  } = $props();

  let editValue = $state(value);
  let inputEl: HTMLInputElement | null = null;

  onMount(() => {
    if (inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onCommit(editValue);
    } else if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Tab') {
      onCommit(editValue);
    }
  }
</script>

<input
  bind:this={inputEl}
  type="text"
  bind:value={editValue}
  onkeydown={handleKeydown}
  onblur={() => onCommit(editValue)}
  class="absolute inset-0 w-full h-full px-1 border-2 border-[var(--ui-primary)] bg-[var(--ui-background)] text-sm text-[var(--ui-foreground)] font-mono outline-none z-10"
/>
