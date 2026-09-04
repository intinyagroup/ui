<script lang="ts">
	import { Select as ArkSelect } from "@ark-ui/svelte/select";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ArkSelect.ItemGroup> = $props();
</script>

<ArkSelect.ItemGroup bind:ref class={cn(className)} {...restProps}>
	{@render children?.()}
</ArkSelect.ItemGroup>
