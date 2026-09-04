<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    src = undefined,
    alt = '',
    initials = undefined,
    ringColor = 'blue',
    size = 'md',
    ringWidth = '4px',
    class: className = ''
  }: {
    src?: string;
    alt?: string;
    initials?: string;
    ringColor?: 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    ringWidth?: string;
    class?: string;
  } = $props();

  const sizeClasses: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const initialsSizeClasses: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl'
  };
</script>

<div
  class={cn(
    'rounded-full overflow-hidden flex items-center justify-center font-medium',
    sizeClasses[size],
    className
  )}
  style="border: {ringWidth} solid var(--flat-{ringColor})"
>
  {#if src}
    <img {src} {alt} class="w-full h-full object-cover" />
  {:else}
    <div
      class="w-full h-full flex items-center justify-center text-white"
      style="background-color: var(--flat-{ringColor})"
    >
      <span class={initialsSizeClasses[size]}>
        {initials ?? ''}
      </span>
    </div>
  {/if}
</div>
