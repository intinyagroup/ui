<script lang="ts" module>
  // Custom drawer is not backed by Ark/Bits; share lock state across instances.
  let bodyScrollLocks = 0;
  let bodyOverflow = "";

  export function lockDrawerBodyScroll() {
    if (bodyScrollLocks++ === 0) {
      bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
  }

  export function unlockDrawerBodyScroll() {
    if (bodyScrollLocks === 0 || --bodyScrollLocks > 0) return;
    document.body.style.overflow = bodyOverflow;
  }
</script>

<script lang="ts">
  import { setContext, tick, type Snippet } from "svelte";

  type DrawerDirection = "top" | "right" | "bottom" | "left";

  let {
    open = $bindable(false),
    direction = "bottom",
    dismissible = true,
    closeOnEscape = true,
    class: className,
    children,
  }: {
    open?: boolean;
    direction?: DrawerDirection;
    /** Whether backdrop interaction closes drawer. Defaults to true. */
    dismissible?: boolean;
    /** Whether Escape closes drawer. Defaults to true. */
    closeOnEscape?: boolean;
    class?: string;
    children?: Snippet;
  } = $props();

  let triggerElement: HTMLElement | null = $state(null);

  function setTrigger(el: HTMLElement) {
    triggerElement = el;
  }

  // Custom drawer owns focus and scroll behavior; Ark/Bits overlays do not use this path.
  $effect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    let cancelled = false;
    let removeListener: (() => void) | undefined;
    lockDrawerBodyScroll();

    // Content renders in same update as `open`; wait before selecting focus target.
    tick().then(() => {
      if (cancelled) return;
      const drawer = document.querySelector(
        '[data-slot="drawer-content"]',
      ) as HTMLElement | null;
      if (!drawer) return;

      const focusableSelector =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusableElements =
        drawer.querySelectorAll<HTMLElement>(focusableSelector);
      focusableElements[0]?.focus();

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key !== "Tab" || focusableElements.length === 0) return;
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }

      drawer.addEventListener("keydown", handleKeyDown);
      removeListener = () =>
        drawer.removeEventListener("keydown", handleKeyDown);
    });

    return () => {
      cancelled = true;
      removeListener?.();
      unlockDrawerBodyScroll();
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  });

  setContext("drawer-state", {
    get open() {
      return open;
    },
    set open(v) {
      open = v;
    },
    get direction() {
      return direction;
    },
    get dismissible() {
      return dismissible;
    },
    get closeOnEscape() {
      return closeOnEscape;
    },
    setTrigger,
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && open && closeOnEscape) {
      open = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={className}>
  {@render children?.()}
</div>
