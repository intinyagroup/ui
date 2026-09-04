<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '$lib/utils';
	let {
		value = $bindable([]),
		multiple = false,
		class: className,
		children
	}: {
		value?: string | string[];
		multiple?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();

	function isSelected(itemValue: string): boolean {
		if (multiple) {
			return Array.isArray(value) && value.includes(itemValue);
		}
		return value === itemValue;
	}

	function toggle(itemValue: string) {
		if (multiple) {
			const current = Array.isArray(value) ? [...value] : [];
			const idx = current.indexOf(itemValue);
			if (idx === -1) {
				current.push(itemValue);
			} else {
				current.splice(idx, 1);
			}
			value = current;
		} else {
			value = itemValue;
		}
	}

	interface SegmentedButtonContext {
		isSelected: (value: string) => boolean;
		toggle: (value: string) => void;
	}

	setContext('segmented-button', {
		isSelected,
		toggle
	} satisfies SegmentedButtonContext);
</script>

<div
	role="group"
	class={cn(
		'inline-flex h-12 items-center overflow-hidden rounded-full',
		'border border-[var(--ui-outline)]',
		'bg-[var(--ui-surface)]',
		className
	)}
>
	{@render children?.()}
</div>
