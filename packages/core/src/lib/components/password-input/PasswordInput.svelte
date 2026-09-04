<script lang="ts">
  import { cn } from '../../utils.js';
  import { Eye, EyeOff } from 'lucide-svelte';

  let {
    value = $bindable(''),
    placeholder = 'Enter password...',
    disabled = false,
    class: className,
    strength = false,
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    strength?: boolean;
  } = $props();

  let showPassword = $state(false);

  function getStrength(val: string): { level: number; label: string; color: string } {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-yellow-500' };
    return { level: 4, label: 'Strong', color: 'bg-green-500' };
  }

  const strengthInfo = $derived(strength ? getStrength(value) : null);
</script>

<div class={cn('relative', className)}>
  <input
    type={showPassword ? 'text' : 'password'}
    bind:value
    {placeholder}
    {disabled}
    class="w-full h-10 pl-3 pr-10 rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] text-sm outline-none transition-colors
      focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-ring)]/20
      disabled:opacity-50 disabled:cursor-not-allowed"
  />
  <button
    onclick={() => showPassword = !showPassword}
    class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] cursor-pointer"
  >
    {#if showPassword}
      <EyeOff class="size-4" />
    {:else}
      <Eye class="size-4" />
    {/if}
  </button>

  {#if strength && value}
    <div class="mt-2">
      <div class="flex gap-1 mb-1">
        {#each [1, 2, 3, 4] as level}
          <div
            class={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              level <= strengthInfo.level ? strengthInfo.color : 'bg-[var(--ui-secondary)]'
            )}
          ></div>
        {/each}
      </div>
      <span class="text-[10px] text-[var(--ui-muted-foreground)]">{strengthInfo.label}</span>
    </div>
  {/if}
</div>
