<script lang="ts" module>
  import { getContext, setContext } from "svelte";
  import { toggleVariants } from "$lib/components/toggle/index.js";
  import type { VariantProps } from "tailwind-variants";

  type ToggleVariants = VariantProps<typeof toggleVariants>;

  interface ToggleGroupContext extends ToggleVariants {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }

  export function setToggleGroupCtx(props: ToggleGroupContext) {
    setContext("toggleGroup", props);
  }

  export function getToggleGroupCtx() {
    return getContext<Required<ToggleGroupContext>>("toggleGroup");
  }
</script>

<script lang="ts">
  import { ToggleGroup as ArkToggleGroup } from "@ark-ui/svelte/toggle-group";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    size = "default",
    spacing = 0,
    orientation = "horizontal",
    variant = "default",
    ...restProps
  }: ComponentProps<typeof ArkToggleGroup.Root> &
    ToggleVariants & {
      spacing?: number;
      orientation?: "horizontal" | "vertical";
    } = $props();

  setToggleGroupCtx({
    get variant() {
      return variant;
    },
    get size() {
      return size;
    },
    get spacing() {
      return spacing;
    },
    get orientation() {
      return orientation;
    },
  });
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<ArkToggleGroup.Root
  value={value as never}
  onValueChange={(e) => {
    value = e.value as never;
    restProps.onValueChange?.(e);
  }}
  bind:ref
  {orientation}
  data-slot="toggle-group"
  data-variant={variant}
  data-size={size}
  data-spacing={spacing}
  style={`--gap: ${spacing}`}
  class={cn(
    "rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch",
    className,
  )}
  {...restProps}
/>
