<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import CheckIcon from "@lucide/svelte/icons/check";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    value,
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.RadioItem> & {
    inset?: boolean;
  } = $props();
</script>

<ArkMenu.RadioItem
  bind:ref
  {value}
  data-slot="context-menu-radio-item"
  class={cn(
    "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    className,
  )}
  {...restProps}
>
  <ArkMenu.ItemIndicator
    class="absolute right-2 flex size-3.5 items-center justify-center"
  >
    <CheckIcon class="size-4" />
  </ArkMenu.ItemIndicator>
  <ArkMenu.ItemText>
    {@render children?.()}
  </ArkMenu.ItemText>
</ArkMenu.RadioItem>
