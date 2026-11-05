import { describe, expect, it } from "vitest";
import {
  createGraphAdapter,
  graphFromJson,
  graphToJson,
  type GraphDocument,
} from "./graph-adapter.js";

const graph: GraphDocument = {
  version: 1,
  nodes: [
    {
      id: "a",
      type: "step",
      position: { x: 10, y: 20 },
      data: { title: "Start" },
    },
  ],
  edges: [{ id: "edge", source: "a", target: "b" }],
  viewport: { x: 5, y: 6, zoom: 1.5 },
};

describe("graph persistence", () => {
  it("round trips nodes, edges and viewport", () => {
    expect(graphFromJson(graphToJson(graph))).toEqual(graph);
  });
  it.each([
    "null",
    "[]",
    '{"version":2,"nodes":[],"edges":[]}',
    '{"version":1,"nodes":{}}',
  ])("rejects unsupported document %s", (input) => {
    expect(() => graphFromJson(input)).toThrow();
  });
  it("isolates input and returned snapshots from stored edits", () => {
    const input = structuredClone(graph);
    const adapter = createGraphAdapter(input);
    input.nodes[0].data!.title = "Changed externally";
    const snapshot = adapter.snapshot;
    snapshot.nodes[0].position.x = 999;
    expect(adapter.snapshot).toEqual(graph);
    const nodes = structuredClone(graph.nodes);
    adapter.setNodes(nodes);
    nodes[0].position.x = 888;
    const edges = structuredClone(graph.edges);
    adapter.setEdges(edges);
    edges[0].target = "other";
    const viewport = { x: 2, y: 3, zoom: 2 };
    adapter.setViewport(viewport);
    viewport.zoom = 99;
    expect(graphFromJson(adapter.toJSON())).toEqual({
      ...graph,
      viewport: { x: 2, y: 3, zoom: 2 },
    });
  });
});
