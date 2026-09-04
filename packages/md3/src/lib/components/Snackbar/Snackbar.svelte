<script lang="ts">
	import { cn } from '$lib/utils';

	type SnackbarProps = {
		message: string;
		action?: string;
		onaction?: () => void;
		ondismiss?: () => void;
		duration?: number;
		show?: boolean;
	};

	let {
		message,
		action,
		onaction,
		ondismiss,
		duration = 5000,
		show = $bindable(false)
	}: SnackbarProps = $props();

	let visible = $state(false);
	let animating = $state(false);
	let dismissTimeout: ReturnType<typeof setTimeout> | null = null;

	function startDismissTimer() {
		clearDismissTimer();
		if (duration > 0) {
			dismissTimeout = setTimeout(() => {
				close();
			}, duration);
		}
	}

	function clearDismissTimer() {
		if (dismissTimeout) {
			clearTimeout(dismissTimeout);
			dismissTimeout = null;
		}
	}

	function close() {
		animating = true;
		visible = false;
		setTimeout(() => {
			show = false;
			animating = false;
			ondismiss?.();
		}, 200);
	}

	function handleAction() {
		onaction?.();
		close();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		}
	}

	$effect(() => {
		if (show) {
			visible = true;
			animating = true;
			startDismissTimer();
			document.addEventListener('keydown', handleKeydown);
		} else {
			clearDismissTimer();
			document.removeEventListener('keydown', handleKeydown);
		}

		return () => {
			clearDismissTimer();
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if show}
	<div
		class={cn(
			'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96',
			'bg-[var(--ui-inverse-surface)] text-[var(--ui-inverse-on-surface)]',
			'rounded-xl px-4 py-3 flex items-center gap-3',
			'shadow-lg z-50',
			visible && animating
				? 'translate-y-0 opacity-100 transition-all duration-200 ease-out'
				: 'translate-y-4 opacity-0 transition-all duration-200 ease-in'
		)}
		role="alert"
		aria-live="polite"
	>
		<span class="flex-1 text-sm font-medium">{message}</span>
		{#if action}
			<button
				type="button"
				class="text-sm font-semibold text-[var(--ui-primary)] hover:opacity-80 transition-opacity"
				onclick={handleAction}
			>
				{action}
			</button>
		{/if}
		<button
			type="button"
			class="text-sm opacity-60 hover:opacity-100 transition-opacity"
			onclick={close}
			aria-label="Dismiss"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M18 6L6 18" />
				<path d="M6 6l12 12" />
			</svg>
		</button>
	</div>
{/if}
