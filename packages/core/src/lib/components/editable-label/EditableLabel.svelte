<script lang="ts">
	import { cn } from '../../utils.js';
	import type { Snippet } from 'svelte';

	let {
		value,
		placeholder = 'Click to edit',
		as = 'span',
		onEdit,
		maxLength,
		class: className
	}: {
		value: string;
		placeholder?: string;
		/** Element used to render the label while not editing. */
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
		onEdit?: (value: string) => void;
		maxLength?: number;
		class?: string;
	} = $props();

	const tag = as as keyof HTMLElementTagNameMap;

	let editing = $state(false);
	let draft = $state(value);
	let inputEl = $state<HTMLInputElement | null>(null);

	const headingSizes: Record<string, string> = {
		h1: 'text-4xl font-bold',
		h2: 'text-3xl font-bold',
		h3: 'text-2xl font-bold',
		h4: 'text-xl font-semibold',
		h5: 'text-lg font-semibold',
		h6: 'text-base font-semibold',
		span: 'text-sm font-medium',
		p: 'text-sm font-medium'
	};

	$effect(() => {
		if (editing && inputEl) {
			inputEl.focus();
			inputEl.select();
		}
	});

	function confirmEdit() {
		const next = draft.trim();
		editing = false;
		if (next !== value) {
			value = next;
			onEdit?.(next);
		}
	}

	function startEdit() {
		draft = value;
		editing = true;
	}

	function cancelEdit() {
		editing = false;
		draft = value;
	}
</script>

{#if editing}
	<input
		bind:this={inputEl}
		bind:value={draft}
		type="text"
		{maxLength}
		aria-label="Edit label"
		class={cn(
			'max-w-full rounded-md border border-[var(--ui-primary)] bg-transparent text-[var(--ui-foreground)] outline-none ring-2 ring-[var(--ui-primary)]/20',
			headingSizes[as]
		)}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				confirmEdit();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				cancelEdit();
			}
		}}
		onblur={confirmEdit}
	/>
{:else}
	<svelte:element
		this={tag}
		class={cn(
			'group inline-flex items-center gap-1.5 cursor-pointer rounded-sm transition-colors hover:text-[var(--ui-primary)]',
			headingSizes[as],
			className
		)}
		role="button"
		tabindex="0"
		title="Click to edit"
		onclick={startEdit}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				startEdit();
			}
		}}
	>
		{value || placeholder}
		<svg
			class="size-3.5 shrink-0 text-[var(--ui-muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
			<path d="m15 5 4 4" />
		</svg>
	</svelte:element>
{/if}