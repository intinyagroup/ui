<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";

  // Bits owns modal focus trapping, focus restoration, and body scroll prevention.
  // Do not add a second lock here; preserve primitive dismissal behavior.
  let { open = $bindable(false), ...restProps }: SheetPrimitive.RootProps =
    $props();
</script>

<SheetPrimitive.Root bind:open {...restProps} />
