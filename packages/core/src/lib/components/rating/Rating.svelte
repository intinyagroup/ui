<script lang="ts">
  import { cn } from '../../utils.js';
  import { Star } from 'lucide-svelte';

  let {
    value = $bindable(0),
    max = 5,
    size = 'md',
    readonly = false,
    disabled = false,
    class: className,
    onchange,
  }: {
    value?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
    disabled?: boolean;
    class?: string;
    onchange?: (value: number) => void;
  } = $props();

  let hoverValue = $state(0);
  let containerRef = $state<HTMLDivElement | null>(null);

  const sizeMap = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-7',
  } as const;

  function clampValue(v: number): number {
    return Math.round(v * 10) / 10;
  }

  function getValueFromPosition(starIndex: number, event: MouseEvent): number {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    return starIndex - (isLeftHalf ? 0.5 : 0);
  }

  function handleClick(starIndex: number, event: MouseEvent) {
    if (readonly || disabled) return;
    const newValue = getValueFromPosition(starIndex, event);
    value = clampValue(newValue === value ? 0 : newValue);
    onchange?.(value);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (readonly || disabled) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp': {
        event.preventDefault();
        const next = Math.min(max, clampValue(value + 0.5));
        value = next;
        onchange?.(next);
        break;
      }
      case 'ArrowLeft':
      case 'ArrowDown': {
        event.preventDefault();
        const prev = Math.max(0, clampValue(value - 0.5));
        value = prev;
        onchange?.(prev);
        break;
      }
      case 'Home': {
        event.preventDefault();
        value = 0;
        onchange?.(0);
        break;
      }
      case 'End': {
        event.preventDefault();
        value = max;
        onchange?.(max);
        break;
      }
    }
  }
</script>

<div
  bind:this={containerRef}
  role="slider"
  aria-label="Rating"
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value}
  aria-valuetext={`${value} out of ${max} stars`}
  aria-readonly={readonly}
  aria-disabled={disabled}
  tabindex={disabled ? -1 : 0}
  class={cn(
    'inline-flex items-center gap-0.5 outline-none',
    disabled && 'pointer-events-none opacity-50',
    className
  )}
  onkeydown={handleKeydown}
>
  {#each Array.from({ length: max }, (_, i) => i + 1) as star}
    {@const displayValue = hoverValue > 0 ? hoverValue : value}
    {@const fillLevel = Math.max(0, Math.min(1, displayValue - (star - 1)))}

    <button
      type="button"
      role="radio"
      aria-checked={value === star}
      aria-label={`${star} star${star > 1 ? 's' : ''}`}
      {disabled}
      {readonly}
      tabindex={-1}
      class={cn(
        'relative cursor-pointer rounded-sm outline-none transition-transform',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        readonly && 'cursor-default',
        disabled && 'cursor-not-allowed',
        !disabled && !readonly && 'hover:scale-110'
      )}
      onclick={(e) => handleClick(star, e)}
      onmouseenter={() => { if (!readonly && !disabled) hoverValue = star; }}
      onmouseleave={() => { hoverValue = 0; }}
    >
      <!-- Empty star (background) -->
      <Star
        class={cn(
          sizeMap[size],
          'text-muted-foreground/30 transition-colors'
        )}
        fill="currentColor"
        strokeWidth={0}
      />

      <!-- Filled portion (foreground, clipped) -->
      <Star
        class={cn(
          sizeMap[size],
          'absolute inset-0 text-yellow-400 transition-colors'
        )}
        style="clip-path: inset(0 {(1 - fillLevel) * 100}% 0 0);"
        fill="currentColor"
        strokeWidth={0}
      />
    </button>
  {/each}
</div>
