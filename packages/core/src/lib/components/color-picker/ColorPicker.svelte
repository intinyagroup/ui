<script lang="ts">
  import { cn } from '../../utils.js';

  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
    '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db',
    '#ffffff',
  ];

  let {
    value = $bindable('#3b82f6'),
    disabled = false,
    class: className,
  }: {
    value?: string;
    disabled?: boolean;
    class?: string;
  } = $props();

  let isOpen = $state(false);

  function handleSelect(color: string) {
    value = color;
  }
</script>

<div class={cn('relative', className)}>
  <button
    onclick={() => isOpen = !isOpen}
    {disabled}
    class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-sm cursor-pointer hover:border-[var(--ui-primary)]/50 transition-colors"
  >
    <div class="size-5 rounded border border-[var(--ui-border)]" style="background-color: {value}"></div>
    <span class="text-xs">{value}</span>
  </button>

  {#if isOpen}
    <div class="absolute top-full left-0 z-50 mt-2 w-64 p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-lg">
      <div class="grid grid-cols-7 gap-1.5 mb-3">
        {#each presetColors as color}
          <button
            onclick={() => handleSelect(color)}
            class={cn(
              "size-7 rounded-md border-2 cursor-pointer transition-transform hover:scale-110",
              value === color ? "border-[var(--ui-primary)]" : "border-transparent"
            )}
            style="background-color: {color}"
          ></button>
        {/each}
      </div>

      <div class="flex items-center gap-2">
        <input
          type="color"
          bind:value
          class="size-8 rounded cursor-pointer"
        />
        <input
          type="text"
          bind:value
          class="flex-1 px-2 py-1.5 rounded border border-[var(--ui-input)] text-xs font-mono"
        />
      </div>
    </div>
  {/if}
</div>
