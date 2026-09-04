<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: MenubarPrimitive.RootProps = $props();
</script>

<MenubarPrimitive.Root
	bind:ref
	data-slot="menubar"
	class={cn(
		"flex h-10 items-center gap-1 rounded-md border bg-background p-1 text-sm shadow-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</MenubarPrimitive.Root>
