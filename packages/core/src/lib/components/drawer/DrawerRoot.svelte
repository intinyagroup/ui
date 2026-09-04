<script lang="ts">
	import { setContext, type Snippet } from "svelte";

	type DrawerDirection = "top" | "right" | "bottom" | "left";

	let {
		open = $bindable(false),
		direction = "bottom",
		class: className,
		children
	}: {
		open?: boolean;
		direction?: DrawerDirection;
		class?: string;
		children?: Snippet;
	} = $props();

	let triggerElement: HTMLElement | null = $state(null);

	function setTrigger(el: HTMLElement) {
		triggerElement = el;
	}

	// Focus trap: trap Tab inside the drawer when open
	$effect(() => {
		if (!open) return;

		const drawer = document.querySelector('[role="dialog"]') as HTMLElement;
		if (!drawer) return;

		const focusableSelector =
			'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const focusableElements = drawer.querySelectorAll(focusableSelector);
		const firstFocusable = focusableElements[0] as HTMLElement | undefined;
		const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement | undefined;

		// Auto-focus first focusable element inside the drawer
		firstFocusable?.focus();

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key !== "Tab") return;

			if (e.shiftKey) {
				if (document.activeElement === firstFocusable) {
					e.preventDefault();
					lastFocusable?.focus();
				}
			} else {
				if (document.activeElement === lastFocusable) {
					e.preventDefault();
					firstFocusable?.focus();
				}
			}
		}

		drawer.addEventListener("keydown", handleKeyDown);
		return () => drawer.removeEventListener("keydown", handleKeyDown);
	});

	// Restore focus to trigger when drawer closes
	$effect(() => {
		if (!open && triggerElement) {
			triggerElement.focus();
		}
	});

	// Lock body scroll when drawer is open
	$effect(() => {
		if (open) {
			const original = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = original;
			};
		}
	});

	setContext("drawer-state", {
		get open() {
			return open;
		},
		set open(v) {
			open = v;
		},
		direction,
		setTrigger
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && open) {
			open = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={className}>
	{@render children?.()}
</div>
