<script lang="ts">
	import { page } from '$app/state';
	import { navigation } from '$lib/navigation';
	import { Menu, X } from 'lucide-svelte';

	let { children } = $props();
	let mobileMenuOpen = $state(false);
</script>

<div class="mx-auto flex max-w-7xl">
	<!-- Desktop sidebar -->
	<aside class="hidden w-60 shrink-0 border-r border-[var(--ui-border)] py-8 pr-4 md:block">
		<nav class="flex flex-col gap-6">
			{#each navigation as section}
				<div>
					<a
						href={section.href}
						class="mb-2 block px-2 text-xs font-semibold uppercase tracking-wide text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]"
					>
						{section.title}
					</a>
					{#if section.items}
						<div class="flex flex-col gap-0.5">
							{#each section.items as item}
								<a
									href={item.href}
									class="rounded-md px-2 py-1.5 text-sm transition-colors {page.url.pathname === item.href
										? 'bg-[var(--ui-muted)] font-medium text-[var(--ui-foreground)]'
										: 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-muted)]'}"
								>
									{item.title}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</nav>
	</aside>

	<!-- Mobile sidebar toggle -->
	<div class="sticky top-14 z-30 flex items-center gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-background)] px-4 py-2 md:hidden">
		<button
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			class="flex items-center gap-2 rounded-md border border-[var(--ui-border)] px-3 py-1.5 text-sm"
		>
			{#if mobileMenuOpen}<X class="size-4" />{:else}<Menu class="size-4" />{/if}
			Navigation
		</button>
	</div>

	{#if mobileMenuOpen}
		<aside class="fixed inset-x-0 top-28 z-20 max-h-[60vh] overflow-y-auto border-b border-[var(--ui-border)] bg-[var(--ui-background)] p-4 shadow-lg md:hidden">
			<nav class="flex flex-col gap-6">
				{#each navigation as section}
					<div>
						<a
							href={section.href}
							onclick={() => (mobileMenuOpen = false)}
							class="mb-2 block px-2 text-xs font-semibold uppercase tracking-wide text-[var(--ui-muted-foreground)]"
						>
							{section.title}
						</a>
						{#if section.items}
							<div class="flex flex-col gap-0.5">
								{#each section.items as item}
									<a
										href={item.href}
										onclick={() => (mobileMenuOpen = false)}
										class="rounded-md px-2 py-1.5 text-sm transition-colors {page.url.pathname === item.href
											? 'bg-[var(--ui-muted)] font-medium text-[var(--ui-foreground)]'
											: 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-muted)]'}"
									>
										{item.title}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</nav>
		</aside>
	{/if}

	<main class="min-w-0 flex-1 px-4 py-8 md:px-8" data-pagefind-body>
		{@render children?.()}
	</main>
</div>
