<script lang="ts">
  import { cn } from '../../utils.js';

  type AvatarItem = {
    id: string;
    name: string;
    image?: string;
    color?: string;
  };

  let {
    avatars = [],
    max = 5,
    size = 'md',
    class: className,
  }: {
    avatars?: AvatarItem[];
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  } = $props();

  const visibleAvatars = $derived(avatars.slice(0, max));
  const remaining = $derived(Math.max(0, avatars.length - max));

  const sizeClasses = {
    sm: 'size-7 text-[10px]',
    md: 'size-9 text-xs',
    lg: 'size-11 text-sm',
  };

  function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  function getColor(index: number): string {
    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    return colors[index % colors.length];
  }
</script>

<div class={cn('flex -space-x-2', className)}>
  {#each visibleAvatars as avatar, i (avatar.id)}
    <div
      class={cn(
        'rounded-full flex items-center justify-center font-bold text-white border-2 border-[var(--ui-card)] relative shrink-0',
        sizeClasses[size]
      )}
      style="background-color: {avatar.color ?? getColor(i)}; z-index: {10 - i};"
      title={avatar.name}
    >
      {#if avatar.image}
        <img src={avatar.image} alt={avatar.name} class="w-full h-full rounded-full object-cover" />
      {:else}
        {getInitials(avatar.name)}
      {/if}
    </div>
  {/each}

  {#if remaining > 0}
    <div
      class={cn(
        'rounded-full flex items-center justify-center font-bold bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)] border-2 border-[var(--ui-card)]',
        sizeClasses[size]
      )}
    >
      +{remaining}
    </div>
  {/if}
</div>
