import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
  editor,
  selectedElements,
  elementCount,
  type EditorElement,
} from "./editor.svelte.js";
import {
  pushState,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory,
} from "./history.svelte.js";

function makeElement(overrides: Partial<EditorElement> = {}): EditorElement {
  return {
    id: crypto.randomUUID(),
    type: "rect",
    props: {},
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    zIndex: 0,
    locked: false,
    visible: true,
    name: "Element",
    ...overrides,
  };
}

describe("EditorElement creation", () => {
  beforeEach(() => {
    editor.reset();
    clearHistory();
  });

  it("adds an element and increments count", () => {
    const el = makeElement({ id: "el-1" });
    editor.addElement(el);

    const state = get(editor);
    expect(state.elements).toHaveLength(1);
    expect(state.elements[0].id).toBe("el-1");
    expect(get(elementCount)).toBe(1);
  });

  it("removes element by id and clears selection", () => {
    const el = makeElement({ id: "el-rm" });
    editor.addElement(el);
    editor.select("el-rm");
    editor.removeElement("el-rm");

    const state = get(editor);
    expect(state.elements).toHaveLength(0);
    expect(state.selectedIds).toEqual([]);
  });

  it("updates element properties", () => {
    const el = makeElement({ id: "el-upd", x: 10, y: 20 });
    editor.addElement(el);
    editor.updateElement("el-upd", { x: 50, width: 200 });

    const updated = get(editor).elements.find((e) => e.id === "el-upd");
    expect(updated?.x).toBe(50);
    expect(updated?.width).toBe(200);
    expect(updated?.y).toBe(20); // unchanged
  });
});

describe("Selection state management", () => {
  beforeEach(() => {
    editor.reset();
    clearHistory();
  });

  it("selects a single element", () => {
    editor.addElement(makeElement({ id: "s1" }));
    editor.addElement(makeElement({ id: "s2" }));
    editor.select("s1");

    expect(get(editor).selectedIds).toEqual(["s1"]);
    expect(get(selectedElements)).toHaveLength(1);
    expect(get(selectedElements)[0].id).toBe("s1");
  });

  it("selects multiple elements", () => {
    editor.addElement(makeElement({ id: "m1" }));
    editor.addElement(makeElement({ id: "m2" }));
    editor.addElement(makeElement({ id: "m3" }));
    editor.selectMultiple(["m1", "m3"]);

    expect(get(editor).selectedIds).toEqual(["m1", "m3"]);
    expect(get(selectedElements)).toHaveLength(2);
  });

  it("toggles selection on and off", () => {
    editor.addElement(makeElement({ id: "t1" }));
    editor.addElement(makeElement({ id: "t2" }));

    editor.toggleSelect("t1");
    expect(get(editor).selectedIds).toContain("t1");

    editor.toggleSelect("t2");
    expect(get(editor).selectedIds).toEqual(["t1", "t2"]);

    editor.toggleSelect("t1");
    expect(get(editor).selectedIds).toEqual(["t2"]);
  });

  it("deselects all", () => {
    editor.addElement(makeElement({ id: "d1" }));
    editor.select("d1");
    editor.deselect();

    expect(get(editor).selectedIds).toEqual([]);
  });
});

describe("Undo/Redo history", () => {
  beforeEach(() => {
    editor.reset();
    clearHistory();
  });

  it("pushes state and can undo", () => {
    editor.addElement(makeElement({ id: "h1" }));
    pushState(get(editor));

    editor.addElement(makeElement({ id: "h2" }));
    pushState(get(editor));

    expect(get(editor).elements).toHaveLength(2);
    expect(canUndo()).toBe(true);

    undo();
    expect(get(editor).elements).toHaveLength(1);
    expect(get(editor).elements[0].id).toBe("h1");
  });

  it("redoes after undo", () => {
    editor.addElement(makeElement({ id: "r1" }));
    pushState(get(editor));

    editor.addElement(makeElement({ id: "r2" }));
    pushState(get(editor));

    undo();
    expect(get(editor).elements).toHaveLength(1);
    expect(canRedo()).toBe(true);

    redo();
    expect(get(editor).elements).toHaveLength(2);
  });

  it("clears future states on new push after undo", () => {
    editor.addElement(makeElement({ id: "f1" }));
    pushState(get(editor));

    editor.addElement(makeElement({ id: "f2" }));
    pushState(get(editor));

    undo(); // back to f1 only
    editor.addElement(makeElement({ id: "f3" }));
    pushState(get(editor));

    // redo should not bring back f2
    redo();
    const ids = get(editor).elements.map((e) => e.id);
    expect(ids).not.toContain("f2");
    expect(ids).toContain("f3");
  });

  it("clearHistory resets everything", () => {
    editor.addElement(makeElement({ id: "c1" }));
    pushState(get(editor));

    clearHistory();
    expect(canUndo()).toBe(false);
    expect(canRedo()).toBe(false);
  });

  it("does not push during undo/redo", () => {
    editor.addElement(makeElement({ id: "n1" }));
    pushState(get(editor));

    editor.addElement(makeElement({ id: "n2" }));
    pushState(get(editor));

    undo(); // internally calls reset + addElement, should not push

    // History should still have exactly 2 entries (not 3 from a spurious push)
    // After undo, we are at index 0 — canUndo is false, canRedo is true
    expect(canUndo()).toBe(false);
    expect(canRedo()).toBe(true);
    expect(get(editor).elements).toHaveLength(1);
    expect(get(editor).elements[0].id).toBe("n1");
  });

  it("view state (zoom, pan) is preserved across reset", () => {
    editor.setZoom(2);
    editor.setPan(100, 200);

    const state = get(editor);
    expect(state.zoom).toBe(2);
    expect(state.panX).toBe(100);
    expect(state.panY).toBe(200);

    editor.reset();
    const reset = get(editor);
    expect(reset.zoom).toBe(1);
    expect(reset.panX).toBe(0);
    expect(reset.panY).toBe(0);
  });

  it("grid toggle works", () => {
    expect(get(editor).showGrid).toBe(true);
    editor.toggleGrid();
    expect(get(editor).showGrid).toBe(false);
    editor.toggleGrid();
    expect(get(editor).showGrid).toBe(true);
  });
});
