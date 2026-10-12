<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    value = $bindable([]),
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.ItemGroup> & {
    value?: string[];
  } = $props();
</script>

<ArkMenu.ItemGroup
  bind:ref
  data-slot="dropdown-menu-checkbox-group"
  {...restProps}
>
  {@render children?.()}
</ArkMenu.ItemGroup>
