<script lang="ts">
	import { cn } from '../../utils.js';
	import type { Snippet } from 'svelte';

	export type CommentItem = {
		id: string | number;
		author: string;
		avatar?: string;
		text: string;
		time: string;
		likes?: number;
	};

	let {
		comments,
		onAddComment,
		onLike,
		onDelete,
		currentUser,
		placeholder = 'Add a comment…',
		class: className,
		commentClass,
		children
	}: {
		comments: CommentItem[];
		onAddComment?: (text: string) => void;
		onLike?: (id: string | number) => void;
		onDelete?: (id: string | number) => void;
		currentUser?: string;
		placeholder?: string;
		class?: string;
		commentClass?: string;
		children?: Snippet;
	} = $props();

	let draft = $state('');

	function canDelete(t: string): boolean {
		return !!currentUser && t === currentUser;
	}

	function submit() {
		const text = draft.trim();
		if (!text) return;
		onAddComment?.(text);
		draft = '';
	}
</script>

<div class={cn('flex flex-col gap-4', className)}>
	{@render children?.()}

	<ul class="space-y-4">
		{#each comments as comment (comment.id)}
			<li class="flex gap-3">
				{#if comment.avatar}
					<img
						src={comment.avatar}
						alt={`${comment.author} avatar`}
						class="h-9 w-9 shrink-0 rounded-full object-cover"
					/>
				{:else}
					<span
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ui-primary)] font-semibold text-[var(--ui-primary-foreground)]"
						aria-hidden="true"
					>
						{comment.author.charAt(0).toUpperCase()}
					</span>
				{/if}

				<div class={cn('min-w-0 flex-1', commentClass)}>
					<div class="flex flex-wrap items-center gap-x-2">
						<span class="text-sm font-semibold text-[var(--ui-foreground)]">
							{comment.author}
						</span>
						{#if canDelete(comment.author)}
							<span class="rounded bg-[var(--ui-muted)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--ui-muted-foreground)]">
								you
							</span>
						{/if}
					</div>
					<p class="mt-0.5 text-sm text-[var(--ui-foreground)]">{comment.text}</p>
					<div class="mt-1 flex items-center gap-3">
						<span class="text-xs text-[var(--ui-muted-foreground)]">{comment.time}</span>
						{#if onLike}
							<button
								type="button"
								class="flex items-center gap-1 text-xs font-medium text-[var(--ui-muted-foreground)] transition-colors hover:text-[var(--ui-primary)]"
								onclick={() => onLike?.(comment.id)}
							>
								{comment.likes ? `${comment.likes} likes` : 'Like'}
							</button>
						{/if}
						{#if canDelete(comment.author)}
							<button
								type="button"
								class="text-xs font-medium text-[var(--ui-destructive)] transition-opacity hover:opacity-70"
								onclick={() => onDelete?.(comment.id)}
							>
								Delete
							</button>
						{/if}
					</div>
				</div>
			</li>
		{/each}
	</ul>

	{#if onAddComment}
		<form
			class="flex items-center gap-2"
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<input
				type="text"
				bind:value={draft}
				placeholder={placeholder}
				aria-label="Add a comment"
				class="min-w-0 flex-1 rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] px-3 py-2 text-sm text-[var(--ui-foreground)] outline-none transition-colors placeholder:text-[var(--ui-muted-foreground)] focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-primary)]/20"
			/>
			<button
				type="submit"
				disabled={!draft.trim()}
				class="rounded-md bg-[var(--ui-primary)] px-3 py-2 text-sm font-semibold text-[var(--ui-primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
			>
				Post
			</button>
		</form>
	{/if}
</div>