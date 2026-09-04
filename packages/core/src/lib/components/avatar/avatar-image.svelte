<script lang="ts">
	import { Avatar as ArkAvatar } from "@ark-ui/svelte/avatar";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof ArkAvatar.Image> = $props();
</script>

<ArkAvatar.Image
	bind:ref
	data-slot="avatar-image"
	class={cn("aspect-square size-full object-cover", className)}
	{...restProps}
/>
