<script lang="ts">
	import { Progress as ArkProgress } from "@ark-ui/svelte/progress";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		max = 100,
		value,
		...restProps
	}: ComponentProps<typeof ArkProgress.Root> = $props();
</script>

<ArkProgress.Root
	bind:ref
	data-slot="progress"
	class={cn("h-1 rounded-full bg-muted relative flex w-full items-center overflow-x-hidden", className)}
	{value}
	{max}
	{...restProps}
>
	<ArkProgress.Track class="w-full h-full bg-muted overflow-hidden rounded-full">
		<ArkProgress.Range class="bg-primary h-full transition-all" />
	</ArkProgress.Track>
</ArkProgress.Root>
