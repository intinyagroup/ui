<script lang="ts">
	import { Avatar as ArkAvatar } from "@ark-ui/svelte/avatar";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkAvatar.Fallback> = $props();
</script>

<ArkAvatar.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cn(
		"bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm font-medium",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ArkAvatar.Fallback>
