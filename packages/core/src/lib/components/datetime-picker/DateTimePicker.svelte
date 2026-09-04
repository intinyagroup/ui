<script lang="ts">
  import { cn } from '../../utils.js';
  import { Input } from '../../components/input/index.js';

  let {
    value = $bindable(''),
    type = 'datetime-local',
    disabled = false,
    class: className,
    onChange,
  }: {
    value?: string;
    type?: 'date' | 'time' | 'datetime-local';
    disabled?: boolean;
    class?: string;
    onChange?: (value: string) => void;
  } = $props();
</script>

<div class={cn('relative', className)}>
  <input
    {type}
    bind:value
    {disabled}
    class="w-full h-10 px-3 rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] text-sm text-[var(--ui-foreground)] outline-none transition-colors
      focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-ring)]/20
      disabled:opacity-50 disabled:cursor-not-allowed
      {type === 'datetime-local' ? 'font-mono' : ''}"
    onchange={(e) => onChange?.(e.currentTarget.value)}
  />
</div>
