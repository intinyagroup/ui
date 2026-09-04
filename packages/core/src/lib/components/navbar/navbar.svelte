<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Menu, X } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		brand,
		links
	}: {
		ref?: HTMLElement | null;
		class?: string;
		children?: import('svelte').Snippet;
		brand?: import('svelte').Snippet;
		links?: import('svelte').Snippet;
	} = $props();

	let open = $state(false);
</script>

<header bind:this={ref} class={cn('sticky top-0 z-40 border-b border-[var(--ui-border)] bg-[var(--ui-background)]/80 backdrop-blur', className)}>
	<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
		<div class="flex items-center gap-2 font-semibold">
			{#if brand}{@render brand()}{:else}<a href="/">Brand</a>{/if}
		</div>
		{#if links}
			<nav class="hidden items-center gap-1 md:flex">
				{@render links()}
			</nav>
		{/if}
		<button
			onclick={() => (open = !open)}
			class="rounded-md p-1.5 hover:bg-[var(--ui-muted)] md:hidden"
			aria-label="Toggle menu"
		>
			{#if open}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
		</button>
	</div>
	{#if open}
		<div class="border-t border-[var(--ui-border)] px-4 py-3 md:hidden">
			{@render children?.()}
		</div>
	{/if}
</header>
