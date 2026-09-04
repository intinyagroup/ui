<script lang="ts">
	import { Search, X } from 'lucide-svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();
	let query = $state('');
	let results = $state<{ url: string; title: string; excerpt: string }[]>([]);
	let pagefind: any = $state(null);
	let loading = $state(false);

	async function loadPagefind() {
		if (pagefind) return;
		try {
			// @ts-ignore — pagefind is generated at build time, not available to Vite bundler
			const path = '/pagefind/pagefind.js';
			pagefind = await import(/* @vite-ignore */ path);
		} catch {
			// pagefind not built yet
		}
	}

	async function search() {
		if (!query.trim() || !pagefind) {
			results = [];
			return;
		}
		loading = true;
		const res = await pagefind.search(query);
		results = await Promise.all(
			res.results.slice(0, 10).map(async (r: any) => {
				const data = await r.data();
				return { url: data.url, title: data.meta?.title ?? data.url, excerpt: data.excerpt };
			})
		);
		loading = false;
	}
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	function onSelect(url: string) {
		open = false;
		window.location.href = url;
	}

	$effect(() => {
		if (open) {
			loadPagefind();
			query = '';
			results = [];
		}
	});

	// Debounced search. Re-runs when query OR pagefind changes so a query
	// typed before pagefind finishes loading still resolves.
	$effect(() => {
		// Read both reactive deps so the effect re-runs on either change.
		if (!open || !query.trim() && !pagefind) return;
		const timer = setTimeout(search, 200);
		return () => clearTimeout(timer);
	});
</script>

<svelte:window onkeydown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open = !open; } }} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick={() => (open = false)}></div>
		<div class="relative z-10 w-full max-w-lg rounded-xl border border-[var(--ui-border)] bg-[var(--ui-background)] shadow-2xl" onkeydown={handleKeydown}>
			<div class="flex items-center gap-3 border-b border-[var(--ui-border)] px-4">
				<Search class="size-4 text-[var(--ui-muted-foreground)]" />
				<input
					bind:value={query}
					placeholder="Search docs... (⌘K)"
					class="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--ui-muted-foreground)]"
					autofocus
				/>
				{#if query}
					<button onclick={() => { query = ''; results = []; }} class="rounded p-1 hover:bg-[var(--ui-muted)]">
						<X class="size-4" />
					</button>
				{/if}
			</div>

			{#if results.length > 0}
				<div class="max-h-80 overflow-y-auto p-2">
					{#each results as result}
						<button
							onclick={() => onSelect(result.url)}
							class="flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left hover:bg-[var(--ui-muted)]"
						>
							<span class="text-sm font-medium">{result.title}</span>
							<span class="text-xs text-[var(--ui-muted-foreground)] line-clamp-2">{@html result.excerpt}</span>
						</button>
					{/each}
				</div>
			{:else if query && !loading}
				<div class="p-6 text-center text-sm text-[var(--ui-muted-foreground)]">No results found.</div>
			{:else if !query}
				<div class="p-6 text-center text-sm text-[var(--ui-muted-foreground)]">Type to search...</div>
			{/if}

			{#if loading}
				<div class="p-4 text-center text-xs text-[var(--ui-muted-foreground)]">Searching...</div>
			{/if}
		</div>
	</div>
{/if}
