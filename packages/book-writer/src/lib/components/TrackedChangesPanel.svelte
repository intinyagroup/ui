<script lang="ts">
  import { Check, X, User, Clock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { TrackedChange } from '../tracked-changes.js';

  let {
    changes,
    enabled,
    onToggle,
    onAccept,
    onReject,
    onAcceptAll,
    onRejectAll,
  }: {
    changes: TrackedChange[];
    enabled: boolean;
    onToggle: () => void;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onAcceptAll: () => void;
    onRejectAll: () => void;
  } = $props();

  const pendingChanges = $derived(changes.filter((c) => !c.accepted));
  const acceptedChanges = $derived(changes.filter((c) => c.accepted));

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function truncateText(text: string, maxLen = 50): string {
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
  }
</script>

<div class="space-y-4">
  <!-- Toggle -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      {#if enabled}
        <Eye class="size-4 text-[var(--ui-primary)]" />
        <span class="text-sm font-medium text-[var(--ui-foreground)]">Track Changes ON</span>
      {:else}
        <EyeOff class="size-4 text-[var(--ui-muted-foreground)]" />
        <span class="text-sm text-[var(--ui-muted-foreground)]">Track Changes OFF</span>
      {/if}
    </div>
    <button
      onclick={onToggle}
      class={cn(
        "relative w-10 h-5 rounded-full transition-colors cursor-pointer",
        enabled ? "bg-[var(--ui-primary)]" : "bg-[var(--ui-secondary)]"
      )}
    >
      <div
        class={cn(
          "absolute top-0.5 size-4 rounded-full bg-white transition-transform shadow-sm",
          enabled ? "translate-x-5" : "translate-x-0.5"
        )}
      ></div>
    </button>
  </div>

  <!-- Pending changes -->
  {#if pendingChanges.length > 0}
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-[var(--ui-foreground)]">
          Pending ({pendingChanges.length})
        </span>
        <div class="flex gap-1">
          <Button variant="ghost" size="sm" class="h-6 px-2 text-[10px]" onclick={onAcceptAll}>
            <CheckCircle class="size-3 mr-1" /> Accept all
          </Button>
          <Button variant="ghost" size="sm" class="h-6 px-2 text-[10px] text-[var(--ui-destructive)]" onclick={onRejectAll}>
            <XCircle class="size-3 mr-1" /> Reject all
          </Button>
        </div>
      </div>

      {#each pendingChanges as change (change.id)}
        <div class="p-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-sm">
          <div class="flex items-center gap-2 mb-1">
            <span class={cn(
              "text-[10px] px-1.5 py-0.5 rounded font-medium",
              change.type === 'insertion' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {change.type === 'insertion' ? '+' : '-'}
            </span>
            <span class="text-xs text-[var(--ui-muted-foreground)]">{truncateText(change.content)}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-[var(--ui-muted-foreground)]">
              {change.userName} · {formatTime(change.timestamp)}
            </span>
            <div class="flex gap-1">
              <button
                onclick={() => onAccept(change.id)}
                class="p-1 rounded text-[var(--ui-success)] hover:bg-[var(--ui-success)]/10 cursor-pointer"
                title="Accept"
              >
                <Check class="size-3.5" />
              </button>
              <button
                onclick={() => onReject(change.id)}
                class="p-1 rounded text-[var(--ui-destructive)] hover:bg-[var(--ui-destructive)]/10 cursor-pointer"
                title="Reject"
              >
                <X class="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Accepted changes (collapsed) -->
  {#if acceptedChanges.length > 0}
    <div class="text-xs text-[var(--ui-muted-foreground)]">
      {acceptedChanges.length} accepted change(s)
    </div>
  {/if}

  {#if changes.length === 0}
    <div class="text-center py-6 text-xs text-[var(--ui-muted-foreground)]">
      No tracked changes yet. Enable tracking to see changes.
    </div>
  {/if}
</div>
