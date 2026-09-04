<script lang="ts">
	import { cn } from '../../utils.js';
	import { Loader2, RefreshCw } from 'lucide-svelte';

	let {
		hasMore = $bindable(true),
		loading = $bindable(false),
		error = $bindable(false),
		onLoadMore,
		onRetry,
		threshold = 200,
		class: className,
		children,
	}: {
		hasMore?: boolean;
		loading?: boolean;
		error?: boolean;
		onLoadMore: () => void | Promise<void>;
		onRetry?: () => void | Promise<void>;
		threshold?: number;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

	let sentinel = $state<HTMLDivElement | null>(null);
	let observer: IntersectionObserver | null = null;

	$effect(() => {
		if (!sentinel) return;

		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasMore && !loading && !error) {
					onLoadMore?.();
				}
			},
			{ rootMargin: `${threshold}px 0px` }
		);

		observer.observe(sentinel);
		return () => observer?.disconnect();
	});
</script>

<div class={cn('relative', className)}>
	{@render children?.()}

	{#if loading}
		<div class="flex items-center justify-center py-6" role="status" aria-live="polite">
			<Loader2 class="size-5 animate-spin text-[var(--ui-muted-foreground)]" />
			<span class="sr-only">Loading more items</span>
		</div>
	{:else if error}
		<div
			class="flex items-center justify-center gap-3 py-6 text-sm text-[var(--ui-muted-foreground)]"
			role="alert"
		>
			<span>Failed to load more items</span>
			<button
				type="button"
				class="inline-flex items-center gap-1.5 rounded-md border border-[var(--ui-border)] px-3 py-1.5 text-xs font-medium text-[var(--ui-primary)] transition-colors hover:bg-[var(--ui-accent)]"
				onclick={() => (onRetry ?? onLoadMore)?.()}
			>
				<RefreshCw class="size-3.5" />
				Retry
			</button>
		</div>
	{:else if !hasMore}
		<p
			class="py-6 text-center text-sm text-[var(--ui-muted-foreground)]"
			role="status"
			aria-live="polite"
		>
			No more items
		</p>
	{/if}

	<div bind:this={sentinel} class="h-px" aria-hidden="true"></div>
</div>