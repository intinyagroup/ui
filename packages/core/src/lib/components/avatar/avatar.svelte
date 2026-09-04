<script lang="ts">
	import { Avatar as ArkAvatar } from "@ark-ui/svelte/avatar";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkAvatar.Root> = $props();
</script>

<ArkAvatar.Root
	bind:ref
	data-slot="avatar"
	class={cn(
		"relative flex size-10 shrink-0 overflow-hidden rounded-full",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ArkAvatar.Root>
