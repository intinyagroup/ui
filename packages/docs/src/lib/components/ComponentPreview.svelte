<script lang="ts">
	import { Eye, Code2 } from 'lucide-svelte';
	import CodeBlock from './CodeBlock.svelte';

	let {
		label,
		code,
		children
	}: {
		label: string;
		code: string;
		children?: import('svelte').Snippet;
	} = $props();

	let tab = $state<'preview' | 'code'>('preview');
</script>

<div class="my-6 overflow-hidden rounded-lg border border-[var(--ui-border)]">
	<div class="flex items-center justify-between border-b border-[var(--ui-border)] px-4 py-2">
		<span class="text-sm font-medium">{label}</span>
		<div class="flex gap-1">
			<button
				onclick={() => (tab = 'preview')}
				class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors {tab === 'preview'
					? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]'
					: 'hover:bg-[var(--ui-muted)]'}"
			>
				<Eye class="size-3.5" />
				Preview
			</button>
			<button
				onclick={() => (tab = 'code')}
				class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors {tab === 'code'
					? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]'
					: 'hover:bg-[var(--ui-muted)]'}"
			>
				<Code2 class="size-3.5" />
				Code
			</button>
		</div>
	</div>

	{#if tab === 'preview'}
		<div class="flex min-h-24 items-center justify-center gap-3 p-8">
			{@render children?.()}
		</div>
	{:else}
		<CodeBlock {code} />
	{/if}
</div>
