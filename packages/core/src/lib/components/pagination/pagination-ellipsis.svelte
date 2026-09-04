<script lang="ts">
	import { Pagination as ArkPagination } from "@ark-ui/svelte/pagination";
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		index,
		...restProps
	}: ComponentProps<typeof ArkPagination.Ellipsis> = $props();
</script>

<ArkPagination.Ellipsis
	bind:ref
	{index}
	aria-hidden="true"
	data-slot="pagination-ellipsis"
	class={cn("flex size-9 items-center justify-center", className)}
	{...restProps}
>
	<EllipsisIcon class="size-4" />
	<span class="sr-only">More pages</span>
</ArkPagination.Ellipsis>
