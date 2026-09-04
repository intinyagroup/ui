<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';

	let { theme = $bindable<'light' | 'dark'>('light') }: { theme?: 'light' | 'dark' } = $props();

	function toggle() {
		theme = theme === 'light' ? 'dark' : 'light';
	}
</script>

<button
	onclick={toggle}
	aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	class="flex size-9 items-center justify-center rounded-md border border-[var(--ui-border)] text-[var(--ui-muted-foreground)] transition-colors hover:bg-[var(--ui-muted)] hover:text-[var(--ui-foreground)]"
>
	{#if theme === 'light'}
		<Moon class="size-4" />
	{:else}
		<Sun class="size-4" />
	{/if}
</button>
