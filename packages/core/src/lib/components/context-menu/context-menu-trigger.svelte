<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.ContextTrigger> = $props();
</script>

<ArkMenu.ContextTrigger
  bind:ref
  data-slot="context-menu-trigger"
  {...restProps}
>
  {@render children?.()}
</ArkMenu.ContextTrigger>
