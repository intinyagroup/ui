<script lang="ts">
  import { toasts, type Toast } from '../../toast/store.js';
  import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';

  const icons: Record<string, any> = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    default: null,
  };

  const colors: Record<string, string> = {
    success: 'border-[var(--ui-success)]/30 bg-[var(--ui-success)]/5',
    error: 'border-[var(--ui-destructive)]/30 bg-[var(--ui-destructive)]/5',
    warning: 'border-[var(--ui-warning)]/30 bg-[var(--ui-warning)]/5',
    info: 'border-[var(--ui-info)]/30 bg-[var(--ui-info)]/5',
    default: 'border-[var(--ui-border)] bg-[var(--ui-card)]',
  };

  const iconColors: Record<string, string> = {
    success: 'text-[var(--ui-success)]',
    error: 'text-[var(--ui-destructive)]',
    warning: 'text-[var(--ui-warning)]',
    info: 'text-[var(--ui-info)]',
    default: 'text-[var(--ui-muted-foreground)]',
  };
</script>

{#snippet toastItem(toast: Toast)}
  {@const Icon = icons[toast.type]}
  {@const colorClass = colors[toast.type]}
  {@const iconColor = iconColors[toast.type]}

  <div
    class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all {colorClass}"
    role="alert"
    aria-live="polite"
  >
    {#if Icon}
      <Icon class="mt-0.5 size-5 shrink-0 {iconColor}" />
    {/if}

    <div class="flex-1 min-w-0">
      {#if toast.title}
        <p class="text-sm font-semibold text-[var(--ui-foreground)]">{toast.title}</p>
      {/if}
      {#if toast.description}
        <p class="mt-1 text-sm text-[var(--ui-muted-foreground)]">{toast.description}</p>
      {/if}
      {#if toast.action}
        <button
          onclick={toast.action.onclick}
          class="mt-2 text-sm font-medium text-[var(--ui-primary)] hover:underline cursor-pointer"
        >
          {toast.action.label}
        </button>
      {/if}
    </div>

    <button
      onclick={() => toasts.dismiss(toast.id)}
      class="shrink-0 rounded-md p-1 text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] transition-colors cursor-pointer"
      aria-label="Dismiss"
    >
      <X class="size-4" />
    </button>
  </div>
{/snippet}

<!-- Toast container -->
<div class="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
  {#each $toasts as toast (toast.id)}
    <div class="pointer-events-auto animate-slide-in-right">
      {@render toastItem(toast)}
    </div>
  {/each}
</div>

<style>
  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
</style>
