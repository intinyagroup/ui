<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronRight } from 'lucide-svelte';
	import { cn } from '../../utils.js';

	let {
		title,
		description,
		leading,
		trailing,
		chevron = false,
		onclick,
		disabled = false,
		class: className
	}: {
		title: string;
		description?: string;
		/** Icon or content rendered on the left, before the text. */
		leading?: Snippet;
		/** Content rendered on the right, after the text. */
		trailing?: Snippet;
		/** Show a chevron hint that the row navigates. */
		chevron?: boolean;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		class?: string;
	} = $props();
</script>

<li
	class={cn('list-none', className)}
>
	{#if onclick}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<button
			type="button"
			{disabled}
			{onclick}
			class="flex min-h-12 w-full cursor-pointer touch-manipulation select-none items-center gap-3 bg-transparent px-4 py-2.5 text-left transition-[background-color,opacity] duration-[var(--ui-transition-fast)] hover:bg-[var(--ui-accent)] active:bg-[var(--ui-accent)] disabled:cursor-not-allowed disabled:opacity-50"
		>
			{@render content()}
		</button>
	{:else}
		<div class="flex min-h-12 w-full items-center gap-3 bg-transparent px-4 py-2.5 text-left">
			{@render content()}
		</div>
	{/if}
</li>

{#snippet content()}
	{#if leading}
		<span
			class="flex shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5 text-[var(--ui-muted-foreground)]"
			aria-hidden="true"
		>
			{@render leading()}
		</span>
	{/if}
	<span class="flex min-w-0 flex-1 flex-col justify-center">
		<span class="truncate text-[15px] font-medium leading-tight text-[var(--ui-foreground)]">
			{title}
		</span>
		{#if description}
			<span class="truncate text-[13px] leading-snug text-[var(--ui-muted-foreground)]">
				{description}
			</span>
		{/if}
	</span>
	{#if trailing}
		<span
			class="flex shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5 text-[var(--ui-muted-foreground)]"
			aria-hidden="true"
		>
			{@render trailing()}
		</span>
	{/if}
	{#if chevron}
		<ChevronRight
			class="h-4 w-4 shrink-0 text-[var(--ui-muted-foreground)]"
			aria-hidden="true"
		/>
	{/if}
{/snippet}
