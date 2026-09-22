<script lang="ts">
  import { SvelteFlow, Background, Controls, MiniMap } from "@xyflow/svelte";
  import type { Snippet } from "svelte";
  import type {
    GraphEdge,
    GraphNode,
    GraphNodeTypeMap,
    GraphViewport,
  } from "./types.js";

  let {
    nodes = [],
    edges = [],
    nodeTypes = {},
    viewport,
    fitView = true,
    showBackground = true,
    showControls = true,
    showMiniMap = false,
    class: className,
    children,
    onConnect,
    onNodeClick,
    onPaneClick,
  }: {
    nodes?: GraphNode[];
    edges?: GraphEdge[];
    nodeTypes?: GraphNodeTypeMap;
    viewport?: GraphViewport;
    fitView?: boolean;
    showBackground?: boolean;
    showControls?: boolean;
    showMiniMap?: boolean;
    class?: string;
    children?: Snippet;
    onConnect?: (connection: unknown) => void;
    onNodeClick?: (event: MouseEvent | TouchEvent, node: GraphNode) => void;
    onPaneClick?: (event: MouseEvent) => void;
  } = $props();

  const flowNodes = $derived(
    nodes.map((node) => ({ ...node, data: node.data ?? {} })),
  );
</script>

<div
  class={`relative h-full min-h-0 w-full overflow-hidden ${className ?? ""}`}
  data-slot="flow-canvas"
>
  <SvelteFlow
    nodes={flowNodes as any}
    edges={edges as any}
    {nodeTypes}
    {fitView}
    {viewport}
    onconnect={(connection) => onConnect?.(connection)}
    onnodeclick={({ event, node }) => onNodeClick?.(event, node as GraphNode)}
    onpaneclick={({ event }) => onPaneClick?.(event)}
  >
    {#if showBackground}<Background />{/if}
    {#if showControls}<Controls />{/if}
    {#if showMiniMap}<MiniMap />{/if}
    {@render children?.()}
  </SvelteFlow>
</div>
