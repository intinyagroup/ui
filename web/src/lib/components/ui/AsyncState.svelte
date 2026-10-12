<script lang="ts">
  import type { Snippet } from "svelte";
  import LoadingState from "./LoadingState.svelte";
  import ErrorState from "./ErrorState.svelte";
  import EmptyState from "./EmptyState.svelte";

  let {
    loading = false,
    error = null,
    empty = false,
    compact = false,
    loadingLabel = "Loading…",
    errorTitle = "Something went wrong",
    errorDescription = "Try again in a moment.",
    emptyTitle = "Nothing here yet",
    emptyDescription = "",
    onRetry,
    loadingContent,
    errorContent,
    emptyContent,
    children,
  }: {
    loading?: boolean;
    error?: unknown;
    empty?: boolean;
    compact?: boolean;
    loadingLabel?: string;
    errorTitle?: string;
    errorDescription?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    onRetry?: () => void;
    loadingContent?: Snippet;
    errorContent?: Snippet;
    emptyContent?: Snippet;
    children?: Snippet;
  } = $props();

  const hasError = $derived(Boolean(error));
</script>

{#if loading}
  {#if loadingContent}{@render loadingContent()}{:else}<LoadingState
      label={loadingLabel}
      {compact}
    />{/if}
{:else if hasError}
  {#if errorContent}{@render errorContent()}{:else}<ErrorState
      title={errorTitle}
      description={errorDescription}
      {onRetry}
    />{/if}
{:else if empty}
  {#if emptyContent}{@render emptyContent()}{:else}<EmptyState
      title={emptyTitle}
      description={emptyDescription}
    />{/if}
{:else if children}
  {@render children()}
{/if}
