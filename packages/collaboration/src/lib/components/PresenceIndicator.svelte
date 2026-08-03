<script lang="ts">
  import { Users } from 'lucide-svelte';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { collaboration, type User } from '../stores/collaboration-store.js';

  let {
    showDetails = false,
  }: {
    showDetails?: boolean;
  } = $props();

  const state = $derived($collaboration);

  function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    return `${Math.floor(diff / 3600000)}h`;
  }
</script>

<div class="flex items-center gap-2">
  <!-- Online avatars -->
  <div class="flex -space-x-2">
    {#each state.users.slice(0, 5) as user (user.id)}
      <div
        class="size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[var(--ui-card)] relative group"
        style="background-color: {user.color}"
        title={user.name}
      >
        {getInitials(user.name)}
        <div class="absolute bottom-0 right-0 size-2 rounded-full bg-[var(--ui-success)] border border-[var(--ui-card)]"></div>
      </div>
    {/each}
    {#if state.users.length > 5}
      <div class="size-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)] border-2 border-[var(--ui-card)]">
        +{state.users.length - 5}
      </div>
    {/if}
  </div>

  {#if state.users.length > 0}
    <span class="text-xs text-[var(--ui-muted-foreground)]">
      {state.users.length} online
    </span>
  {/if}

  <!-- Connection status -->
  <div class="flex items-center gap-1">
    <div class="size-2 rounded-full {state.connected ? 'bg-[var(--ui-success)]' : 'bg-[var(--ui-destructive)]'}"></div>
    <span class="text-[10px] text-[var(--ui-muted-foreground)]">
      {state.connected ? 'Live' : 'Offline'}
    </span>
  </div>
</div>
