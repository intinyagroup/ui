<script lang="ts">
	import { Pagination as ArkPagination } from "@ark-ui/svelte/pagination";
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { buttonVariants } from "$lib/components/button/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkPagination.NextTrigger> = $props();
</script>

<ArkPagination.NextTrigger
	bind:ref
	aria-label="Go to next page"
	class={cn(
		buttonVariants({
			variant: "ghost",
			size: "default",
		}),
		"gap-1 px-2.5 sm:pr-2.5 cursor-pointer",
		className
	)}
	{...restProps}
>
	<span class="hidden sm:block">Next</span>
	<ChevronRightIcon class="size-4" />
</ArkPagination.NextTrigger>
