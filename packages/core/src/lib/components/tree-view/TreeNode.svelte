<script lang="ts">
	import { ChevronRight, ChevronDown, File, Folder } from 'lucide-svelte';
	import { cn } from '../../utils.js';
	import type { TreeViewNode } from './TreeView.svelte';

	let {
		node,
		depth = 0,
		selected = $bindable([]),
		multiple = false,
		expandedIds,
		onToggle,
		onSelect,
	}: {
		node: TreeViewNode;
		depth?: number;
		selected?: string[];
		multiple?: boolean;
		expandedIds: Set<string>;
		onToggle: (id: string) => void;
		onSelect: (id: string) => void;
	} = $props();

	let isExpanded = $derived(expandedIds.has(node.id));
	let isSelected = $derived(selected.includes(node.id));
	let hasChildren = $derived(!!node.children?.length);

	function handleToggle(e: MouseEvent) {
		e.stopPropagation();
		onToggle(node.id);
	}

	function handleSelect() {
		if (node.disabled) return;
		onSelect(node.id);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleSelect();
		}
		if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
			e.preventDefault();
			onToggle(node.id);
		}
		if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
			e.preventDefault();
			onToggle(node.id);
		}
	}

	const iconClasses = 'size-4 shrink-0 text-[var(--ui-muted-foreground)]';
</script>

<div
	role="treeitem"
	aria-expanded={hasChildren ? isExpanded : undefined}
	aria-selected={isSelected}
	aria-disabled={node.disabled}
	aria-level={depth + 1}
	data-tree-node={node.id}
	tabindex={node.disabled ? -1 : 0}
>
	<button
		type="button"
		class={cn(
			'group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors outline-none',
			'hover:bg-[var(--ui-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)]',
			isSelected && 'bg-[var(--ui-primary)]/10 text-[var(--ui-primary)] font-medium',
			node.disabled && 'cursor-not-allowed opacity-50'
		)}
		style:padding-left="{depth * 16 + 8}px"
		onclick={handleSelect}
		onkeydown={handleKeyDown}
	>
		{#if hasChildren}
			<span
				role="button"
				tabindex="-1"
				class={cn(
					'flex size-4 shrink-0 items-center justify-center rounded transition-transform',
					'hover:bg-[var(--ui-muted)]'
				)}
				onclick={handleToggle}
				aria-label={isExpanded ? 'Collapse' : 'Expand'}
			>
				{#if isExpanded}
					<ChevronDown class="size-3.5" />
				{:else}
					<ChevronRight class="size-3.5" />
				{/if}
			</span>
		{:else}
			<span class="size-4 shrink-0"></span>
		{/if}

		{#if node.icon}
			<span class={iconClasses}>
				{node.icon}
			</span>
		{:else if hasChildren}
			<Folder class={iconClasses} />
		{:else}
			<File class={iconClasses} />
		{/if}

		<span class="truncate">{node.label}</span>
	</button>

	{#if hasChildren && isExpanded}
		<div role="group">
			{#each node.children as child (child.id)}
				<svelte:self
					node={child}
					depth={depth + 1}
					{selected}
					{multiple}
					{expandedIds}
					{onToggle}
					{onSelect}
				/>
			{/each}
		</div>
	{/if}
</div>
