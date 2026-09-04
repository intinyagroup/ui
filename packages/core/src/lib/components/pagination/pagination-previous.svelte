<script lang="ts">
	import { Pagination as ArkPagination } from "@ark-ui/svelte/pagination";
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { buttonVariants } from "$lib/components/button/index.js";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkPagination.PrevTrigger> = $props();
</script>

<ArkPagination.PrevTrigger
	bind:ref
	aria-label="Go to previous page"
	class={cn(
		buttonVariants({
			variant: "ghost",
			size: "default",
		}),
		"gap-1 px-2.5 sm:pl-2.5 cursor-pointer",
		className
	)}
	{...restProps}
>
	<ChevronLeftIcon class="size-4" />
	<span class="hidden sm:block">Previous</span>
</ArkPagination.PrevTrigger>
