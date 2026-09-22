import type { GraphEdge, GraphNode, GraphViewport } from "./types.js";

export type GraphDocument = {
  version: 1;
  nodes: GraphNode[];
  edges: GraphEdge[];
  viewport?: GraphViewport;
};

export function graphToJson(document: GraphDocument): string {
  return JSON.stringify(document, null, 2);
}

export function graphFromJson(input: string): GraphDocument {
  const parsed: unknown = JSON.parse(input);
  if (!parsed || typeof parsed !== "object")
    throw new Error("Graph document must be an object");
  const value = parsed as Partial<GraphDocument>;
  if (
    value.version !== 1 ||
    !Array.isArray(value.nodes) ||
    !Array.isArray(value.edges)
  ) {
    throw new Error("Unsupported graph document");
  }
  return {
    version: 1,
    nodes: value.nodes,
    edges: value.edges,
    viewport: value.viewport,
  };
}

export function createGraphAdapter(
  initial: GraphDocument = { version: 1, nodes: [], edges: [] },
) {
  let document = structuredClone(initial);
  return {
    get snapshot() {
      return structuredClone(document);
    },
    setNodes(nodes: GraphNode[]) {
      document = { ...document, nodes: structuredClone(nodes) };
    },
    setEdges(edges: GraphEdge[]) {
      document = { ...document, edges: structuredClone(edges) };
    },
    setViewport(viewport: GraphViewport) {
      document = { ...document, viewport: { ...viewport } };
    },
    toJSON() {
      return graphToJson(document);
    },
  };
}
