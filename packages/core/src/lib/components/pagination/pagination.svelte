<script lang="ts">
	import { Pagination as ArkPagination } from "@ark-ui/svelte/pagination";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		page = $bindable(1),
		count,
		pageSize = 10,
		children,
		...restProps
	}: ComponentProps<typeof ArkPagination.Root> = $props();
</script>

<ArkPagination.Root
	bind:ref
	bind:page
	{count}
	{pageSize}
	data-slot="pagination"
	class={cn("mx-auto flex w-full justify-center", className)}
	{...restProps}
>
	{@render children?.()}
</ArkPagination.Root>
