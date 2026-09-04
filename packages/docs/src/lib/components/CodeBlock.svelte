<script lang="ts">
	import { Check, Copy } from 'lucide-svelte';

	let {
		code,
		lang = 'svelte',
		title
	}: {
		code: string;
		lang?: string;
		title?: string;
	} = $props();

	let copied = $state(false);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// clipboard unavailable
		}
	}

	// Collapse leading/trailing blank lines and dedent for display
	const display = code.replace(/^\n+|\s+$/g, '');
</script>

<div class="my-4 overflow-hidden rounded-lg border border-[var(--ui-border)] bg-[oklch(0.16_0.01_260)]">
	<div class="flex items-center justify-between border-b border-white/10 px-4 py-2">
		<span class="font-mono text-xs text-white/60">{title ?? lang}</span>
		<button
			onclick={copyCode}
			class="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
		>
			{#if copied}
				<Check class="size-3.5" />
				Copied
			{:else}
				<Copy class="size-3.5" />
				Copy
			{/if}
		</button>
	</div>
	<pre class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-white/90"><code>{display}</code></pre>
</div>
