<script lang="ts">
	import '../app.css';
	import { Search } from 'lucide-svelte';
	import SearchDialog from '$lib/components/SearchDialog.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
	let theme = $state<'light' | 'dark'>('light');
	let searchOpen = $state(false);

	$effect(() => {
		// Load saved theme on mount, falling back to the system preference
		const saved = localStorage.getItem('ui-theme');
		if (saved === 'dark' || saved === 'light') {
			theme = saved;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}
	});

	$effect(() => {
		document.documentElement.dataset.uiTheme = theme;
		localStorage.setItem('ui-theme', theme);
	});
</script>

<svelte:head>
	<title>Intinya UI — Docs</title>
	<meta name="description" content="Intinya UI component library — 100+ Svelte 5 components, 9 themes, CLI installer, mobile + native." />
</svelte:head>

<div class="min-h-screen">
	<header class="sticky top-0 z-40 border-b border-[var(--ui-border)] bg-[var(--ui-background)]/80 backdrop-blur">
		<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<span class="flex size-6 items-center justify-center rounded-md bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] text-xs font-bold">V</span>
				Intinya UI
			</a>
			<nav class="hidden items-center gap-1 md:flex">
				<a href="/docs" class="rounded-md px-3 py-1.5 text-sm hover:bg-[var(--ui-muted)]">Docs</a>
				<a href="/docs/components" class="rounded-md px-3 py-1.5 text-sm hover:bg-[var(--ui-muted)]">Components</a>
				<a href="https://github.com/intinyagroup/ui" target="_blank" class="rounded-md px-3 py-1.5 text-sm hover:bg-[var(--ui-muted)]">GitHub</a>
			</nav>
			<div class="flex items-center gap-2">
				<button
					onclick={() => (searchOpen = true)}
					class="flex items-center gap-2 rounded-md border border-[var(--ui-border)] px-3 py-1.5 text-sm text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-muted)]"
				>
					<Search class="size-3.5" />
					<span class="hidden sm:inline">Search</span>
					<kbd class="hidden rounded border border-[var(--ui-border)] bg-[var(--ui-muted)] px-1.5 py-0.5 text-[10px] font-mono sm:inline">⌘K</kbd>
				</button>
				<ThemeToggle bind:theme />
			</div>
		</div>
	</header>

	{@render children?.()}
</div>

<SearchDialog bind:open={searchOpen} />
