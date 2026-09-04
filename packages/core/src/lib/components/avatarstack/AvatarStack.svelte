<script lang="ts">
	import { cn } from '../../utils.js';

	let {
		srcs,
		max = 5,
		size = 'md',
		class: className
	}: {
		srcs: string[];
		/** Maximum avatars shown before collapsing into a +N badge. */
		max?: number;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	} = $props();

	const sizes = {
		sm: { box: 'h-7 w-7', text: 'text-[11px]' },
		md: { box: 'h-9 w-9', text: 'text-xs' },
		lg: { box: 'h-12 w-12', text: 'text-sm' }
	} as const;

	const shown = Math.max(0, Math.min(srcs.length, max));
	const visible = srcs.slice(0, shown);
	const extra = srcs.length - shown;
	const s = sizes[size];
</script>

<div
	class={cn('flex items-center', className)}
	role="img"
	aria-label={`${shown} of ${srcs.length} avatars${extra > 0 ? `, ${extra} more` : ''}`}
>
	{#each visible as src, i (src)}
		<img
			src={src}
			alt=""
			class={cn(
				'rounded-full border-2 border-[var(--ui-background)] object-cover',
				s.box,
				i > 0 && '-ml-2'
			)}
		/>
	{/each}
	{#if extra > 0}
		<span
			class={cn(
				'flex -ml-2 items-center justify-center rounded-full border-2 border-[var(--ui-background)] bg-[var(--ui-muted)] font-semibold text-[var(--ui-muted-foreground)]',
				s.box,
				s.text
			)}
			aria-hidden="true"
			>+{extra}</span
		>
	{/if}
</div>
