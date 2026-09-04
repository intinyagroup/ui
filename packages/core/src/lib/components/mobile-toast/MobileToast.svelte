<script lang="ts">
	import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-svelte';
	import { cn } from '../../utils.js';

	let {
		message,
		open = $bindable(false),
		variant = 'default',
		duration = 4000,
		position = 'bottom',
		action,
		onAction,
		ondismiss,
		class: className
	}: {
		message: string;
		open?: boolean;
		variant?: 'default' | 'success' | 'error' | 'warning';
		duration?: number;
		position?: 'bottom' | 'top';
		action?: string;
		onAction?: () => void;
		ondismiss?: () => void;
		class?: string;
	} = $props();

	let visible = $state(open);
	let leaving = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const icons = {
		default: Info,
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertTriangle
	};

	const styles = {
		default: 'bg-[var(--ui-foreground)] text-[var(--ui-background)]',
		success: 'bg-emerald-600 text-white',
		error: 'bg-red-600 text-white',
		warning: 'bg-amber-500 text-white'
	};

	function show() {
		visible = true;
		leaving = false;
		if (timer) clearTimeout(timer);
		if (duration > 0 && !action) {
			timer = setTimeout(hide, duration);
		}
	}

	function hide() {
		leaving = true;
		ondismiss?.();
		setTimeout(() => {
			visible = false;
			open = false;
		}, 200);
	}

	function handleAction() {
		onAction?.();
		hide();
	}

	$effect(() => {
		if (open) show();
	});

	$effect(() => {
		return () => { if (timer) clearTimeout(timer); };
	});

	const Icon = icons[variant];
</script>

{#if visible}
	<div
		class={cn(
			'fixed inset-x-0 z-50 flex justify-center px-4',
			position === 'bottom' ? 'bottom-0 pb-[calc(1rem+env(safe-area-inset-bottom))]' : 'top-0 pt-[calc(1rem+env(safe-area-inset-top))]',
			className
		)}
		role="status"
		aria-live="polite"
	>
		<div
			class={cn(
				'flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 shadow-xl transition-all duration-200',
				styles[variant],
				leaving ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
			)}
		>
			<Icon class="size-5 shrink-0" />
			<span class="flex-1 text-sm font-medium">{message}</span>
			{#if action}
				<button onclick={handleAction} class="text-sm font-semibold underline underline-offset-2">
					{action}
				</button>
			{/if}
			<button onclick={hide} class="rounded-full p-1 opacity-70 hover:opacity-100" aria-label="Dismiss">
				<X class="size-4" />
			</button>
		</div>
	</div>
{/if}