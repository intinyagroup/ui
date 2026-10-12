<script lang="ts">
  import { Portal, type PortalProps } from "@ark-ui/svelte/portal";

  let { ...restProps }: PortalProps = $props();
</script>

<Portal {...restProps} />
