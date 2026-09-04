<script lang="ts">
	import { Tabs as ArkTabs } from '@ark-ui/svelte/tabs';
	import { cn } from '@intinyagroup/ui/utils';
	import type { Snippet } from 'svelte';

	let {
		svelteSnippet,
		reactSnippet
	}: {
		svelteSnippet: Snippet;
		reactSnippet: Snippet;
	} = $props();

	let activeTab = $state('svelte');
</script>

<div class="my-4 rounded-lg border border-[var(--ui-border)] overflow-hidden bg-[var(--ui-card)]">
	<ArkTabs.Root bind:value={activeTab} class="w-full">
		<ArkTabs.List class="flex border-b border-[var(--ui-border)] bg-[var(--ui-muted)]/50 px-3 pt-2 gap-2 text-xs font-semibold">
			<ArkTabs.Trigger
				value="svelte"
				class={cn(
					"px-3 py-1.5 rounded-t-md border-b-2 border-transparent transition-colors cursor-pointer outline-none",
					activeTab === 'svelte' ? "border-[var(--ui-primary)] text-[var(--ui-primary)] bg-[var(--ui-background)]" : "text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]"
				)}
			>
				Svelte 5
			</ArkTabs.Trigger>
			<ArkTabs.Trigger
				value="react"
				class={cn(
					"px-3 py-1.5 rounded-t-md border-b-2 border-transparent transition-colors cursor-pointer outline-none",
					activeTab === 'react' ? "border-[var(--ui-primary)] text-[var(--ui-primary)] bg-[var(--ui-background)]" : "text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]"
				)}
			>
				React 19
			</ArkTabs.Trigger>
		</ArkTabs.List>

		<ArkTabs.Content value="svelte" class="p-4 outline-none">
			{@render svelteSnippet()}
		</ArkTabs.Content>

		<ArkTabs.Content value="react" class="p-4 outline-none">
			{@render reactSnippet()}
		</ArkTabs.Content>
	</ArkTabs.Root>
</div>
