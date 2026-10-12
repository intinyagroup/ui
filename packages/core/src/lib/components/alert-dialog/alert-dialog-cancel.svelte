<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import {
    buttonVariants,
    type ButtonVariant,
    type ButtonSize,
  } from "$lib/components/button/index.js";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    variant = "outline",
    size = "default",
    ...restProps
  }: ComponentProps<typeof ArkDialog.CloseTrigger> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  } = $props();
</script>

<ArkDialog.CloseTrigger
  bind:ref
  data-slot="alert-dialog-cancel"
  class={cn(
    buttonVariants({ variant, size }),
    "cn-alert-dialog-cancel",
    className,
  )}
  {...restProps}
/>
