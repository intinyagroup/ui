import { describe, it, expect } from "vitest";
import {
  flatToTree,
  treeToFlat,
  filterTree,
  sortTree,
  cascadeSelect,
} from "./tree-model.js";

interface DeptItem {
  id: string;
  name: string;
  parentId?: string | null;
}

describe("tree-model", () => {
  const flatData: DeptItem[] = [
    { id: "1", name: "Executive", parentId: null },
    { id: "2", name: "Engineering", parentId: "1" },
    { id: "3", name: "Frontend Team", parentId: "2" },
    { id: "4", name: "Backend Team", parentId: "2" },
    { id: "5", name: "Marketing", parentId: "1" },
  ];

  it("converts flat self-referencing data to tree structure", () => {
    const tree = flatToTree(flatData);
    expect(tree).toHaveLength(1);
    expect(tree[0].name).toBe("Executive");
    expect(tree[0].level).toBe(0);
    expect(tree[0].children).toHaveLength(2); // Engineering, Marketing
    expect(tree[0].children![0].children).toHaveLength(2); // Frontend, Backend
    expect(tree[0].children![0].children![0].level).toBe(2);
  });

  it("flattens visible tree nodes based on expanded state", () => {
    const tree = flatToTree(flatData);
    // Expand only root ("1")
    const flat1 = treeToFlat(tree, new Set(["1"]));
    expect(flat1.map((f) => f.id)).toEqual(["1", "2", "5"]);

    // Expand "1" and "2"
    const flat2 = treeToFlat(tree, new Set(["1", "2"]));
    expect(flat2.map((f) => f.id)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("filters tree while preserving parent hierarchy", () => {
    const tree = flatToTree(flatData);
    // Search for "Backend"
    const filtered = filterTree(tree, (item) => item.name.includes("Backend"));
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
    expect(filtered[0].children).toHaveLength(1);
    expect(filtered[0].children![0].id).toBe("2");
    expect(filtered[0].children![0].children![0].id).toBe("4");
  });

  it("sorts sibling nodes recursively", () => {
    const tree = flatToTree(flatData);
    const sorted = sortTree(tree, (a, b) => b.name.localeCompare(a.name));
    // Under Executive ("1"), Marketing comes before Engineering in descending sort
    expect(sorted[0].children![0].name).toBe("Marketing");
    expect(sorted[0].children![1].name).toBe("Engineering");
  });

  it("handles cascading selection and indeterminate states", () => {
    const tree = flatToTree(flatData);

    // Select Frontend Team ("3") only
    const res1 = cascadeSelect(tree, new Set(), "3", true);
    expect(res1.selected.has("3")).toBe(true);
    expect(res1.selected.has("2")).toBe(false);
    expect(res1.indeterminate.has("2")).toBe(true);
    expect(res1.indeterminate.has("1")).toBe(true);

    // Select Backend Team ("4") as well -> Engineering ("2") should become fully selected
    const res2 = cascadeSelect(tree, res1.selected, "4", true);
    expect(res2.selected.has("2")).toBe(true);
    expect(res2.indeterminate.has("2")).toBe(false);
    // Executive ("1") is still indeterminate because Marketing ("5") is not selected
    expect(res2.indeterminate.has("1")).toBe(true);
  });
});
