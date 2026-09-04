<script lang="ts" module>
	export type TreeViewNode = {
		id: string;
		label: string;
		icon?: string;
		children?: TreeViewNode[];
		expanded?: boolean;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import { cn } from '../../utils.js';
	import TreeNode from './TreeNode.svelte';

	let {
		data = [],
		class: className,
		selected = $bindable([]),
		multiple = false,
		onSelect,
		onExpand,
	}: {
		data: TreeViewNode[];
		class?: string;
		selected?: string[];
		multiple?: boolean;
		onSelect?: (ids: string[]) => void;
		onExpand?: (id: string, expanded: boolean) => void;
	} = $props();

	function initExpanded(nodes: TreeViewNode[]): Set<string> {
		const ids = new Set<string>();
		function collect(list: TreeViewNode[]) {
			for (const n of list) {
				if (n.expanded) ids.add(n.id);
				if (n.children) collect(n.children);
			}
		}
		collect(nodes);
		return ids;
	}

	let expandedIds = $state<Set<string>>(new Set());
	$effect(() => {
		expandedIds = initExpanded(data);
	});

	function toggleExpand(id: string) {
		const next = new Set(expandedIds);
		const willExpand = !next.has(id);
		if (willExpand) {
			next.add(id);
		} else {
			next.delete(id);
		}
		expandedIds = next;
		onExpand?.(id, willExpand);
	}

	function handleSelect(id: string) {
		if (multiple) {
			const idx = selected.indexOf(id);
			if (idx >= 0) {
				selected = selected.filter((s) => s !== id);
			} else {
				selected = [...selected, id];
			}
		} else {
			selected = [id];
		}
		onSelect?.(selected);
	}
</script>

<div
	class={cn('w-full text-sm', className)}
	role="tree"
	aria-multiselectable={multiple}
	aria-label="Tree view"
>
	{#each data as node (node.id)}
		<TreeNode
			{node}
			{selected}
			{multiple}
			{expandedIds}
			onToggle={toggleExpand}
			onSelect={handleSelect}
		/>
	{/each}
</div>
