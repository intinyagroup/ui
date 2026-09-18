<script lang="ts">
  import {
    CircleAlert,
    CircleCheck,
    Info,
    LoaderCircle,
    TriangleAlert,
    X,
  } from "lucide-svelte";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "$lib/utils.js";

  export type MessageTone =
    "info" | "success" | "warning" | "error" | "loading";

  export type MessageAction = {
    label: string;
    onclick?: () => void;
  };

  export type MessageProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    tone?: MessageTone;
    title?: string;
    message?: string;
    description?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
    ondismiss?: () => void;
    action?: Snippet | MessageAction;
    actionLabel?: string;
    onAction?: () => void;
    onaction?: () => void;
  };

  const icons = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleAlert,
    loading: LoaderCircle,
  } as const;

  const toneClasses: Record<MessageTone, string> = {
    info: "border-[var(--ui-info)]/30 bg-[var(--ui-info)]/5 text-[var(--ui-info)]",
    success:
      "border-[var(--ui-success)]/30 bg-[var(--ui-success)]/5 text-[var(--ui-success)]",
    warning:
      "border-[var(--ui-warning)]/30 bg-[var(--ui-warning)]/5 text-[var(--ui-warning)]",
    error:
      "border-[var(--ui-destructive)]/30 bg-[var(--ui-destructive)]/5 text-[var(--ui-destructive)]",
    loading:
      "border-[var(--ui-border)] bg-[var(--ui-muted)]/40 text-[var(--ui-muted-foreground)]",
  };

  let {
    ref = $bindable(null),
    class: className,
    tone = "info",
    title,
    message,
    description,
    dismissible = undefined,
    onDismiss,
    ondismiss,
    action,
    actionLabel,
    onAction,
    onaction,
    children,
    ...restProps
  }: MessageProps & { children?: Snippet } = $props();

  let dismissed = $state(false);

  const isDismissible = $derived(dismissible ?? tone !== "loading");
  const Icon = $derived(icons[tone]);
  const body = $derived(message ?? description);
  const actionObject = $derived(
    typeof action === "object" && action !== null ? action : undefined,
  );
  const actionSnippet = $derived(
    typeof action === "function" ? action : undefined,
  );
  const resolvedActionLabel = $derived(actionLabel ?? actionObject?.label);
  const resolvedAction = $derived(
    onAction ?? onaction ?? actionObject?.onclick,
  );

  function dismiss() {
    if (!isDismissible || dismissed) return;
    dismissed = true;
    onDismiss?.();
    ondismiss?.();
  }
</script>

{#if !dismissed}
  <div
    bind:this={ref}
    data-slot="message"
    data-tone={tone}
    role={tone === "error" ? "alert" : "status"}
    aria-live={tone === "error" ? "assertive" : "polite"}
    aria-atomic="true"
    class={cn(
      "relative flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm",
      toneClasses[tone],
      className,
    )}
    {...restProps}
  >
    <Icon
      class={cn(
        "mt-0.5 size-4 shrink-0",
        tone === "loading" &&
          "motion-safe:animate-spin motion-reduce:animate-none",
      )}
      aria-hidden="true"
    />

    <div class="min-w-0 flex-1 text-[var(--ui-foreground)]">
      {#if title}
        <p class="font-medium">{title}</p>
      {/if}
      {#if body}
        <p class={cn(title && "mt-0.5", "text-[var(--ui-muted-foreground)]")}>
          {body}
        </p>
      {/if}
      {#if children}
        <div
          class={cn(
            (title || body) && "mt-0.5",
            "text-[var(--ui-muted-foreground)]",
          )}
        >
          {@render children()}
        </div>
      {/if}
      {#if actionSnippet}
        <div class="mt-2">
          {@render actionSnippet()}
        </div>
      {:else if resolvedActionLabel}
        <button
          type="button"
          class="mt-2 cursor-pointer font-medium text-[var(--ui-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]"
          onclick={() => resolvedAction?.()}
        >
          {resolvedActionLabel}
        </button>
      {/if}
    </div>

    {#if isDismissible}
      <button
        type="button"
        class="-mr-1 -mt-1 shrink-0 cursor-pointer rounded-md p-1 text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]"
        aria-label="Dismiss message"
        onclick={dismiss}
      >
        <X class="size-4" aria-hidden="true" />
      </button>
    {/if}
  </div>
{/if}
