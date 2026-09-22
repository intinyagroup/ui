import type { Component, Snippet } from "svelte";

export type GraphViewport = { x: number; y: number; zoom: number };

export type GraphHandle = {
  id: string;
  type: "source" | "target";
  position?: "top" | "right" | "bottom" | "left";
  dataType?: string;
  multiple?: boolean;
};

export type GraphNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data?: Record<string, unknown>;
  handles?: GraphHandle[];
  selected?: boolean;
  hidden?: boolean;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: Record<string, unknown>;
  selected?: boolean;
  animated?: boolean;
};

export type GraphChange =
  | { type: "node-position"; id: string; position: { x: number; y: number } }
  | { type: "node-select"; id: string; selected: boolean }
  | { type: "node-remove"; id: string }
  | { type: "edge-remove"; id: string }
  | { type: "edge-add"; edge: GraphEdge };

export type GraphNodeTypeMap = Record<string, Component>;

export type InspectorField = {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "boolean" | "textarea" | "secret";
  description?: string;
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
};

export type InspectorShellProps = {
  title?: string;
  description?: string;
  children?: Snippet;
};
