<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkMenu.Separator> = $props();
</script>

<ArkMenu.Separator
  bind:ref
  data-slot="menubar-separator"
  class={cn("-mx-1 my-1 h-px bg-border", className)}
  {...restProps}
/>
