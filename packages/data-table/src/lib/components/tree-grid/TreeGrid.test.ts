import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import TreeGrid from "./TreeGrid.svelte";

interface TaskItem {
  id: string;
  name: string;
  owner: string;
  parentId?: string | null;
}

describe("TreeGrid", () => {
  const flatData: TaskItem[] = [
    { id: "1", name: "Project Alpha", owner: "Alice", parentId: null },
    { id: "2", name: "Design Phase", owner: "Bob", parentId: "1" },
    { id: "3", name: "Development Phase", owner: "Charlie", parentId: "1" },
    { id: "4", name: "Frontend Setup", owner: "Dave", parentId: "3" },
  ];

  const columns = [
    {
      id: "name",
      header: "Task Name",
      accessorKey: "name" as const,
      treeColumn: true,
    },
    { id: "owner", header: "Owner", accessorKey: "owner" as const },
  ];

  it("renders tree grid header and root rows", () => {
    render(TreeGrid, { data: flatData, columns });

    expect(screen.getByText("Task Name")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    // Initially children are collapsed so Design Phase shouldn't be rendered
    expect(screen.queryByText("Design Phase")).not.toBeInTheDocument();
  });

  it("expands root node to reveal children when chevron clicked", async () => {
    render(TreeGrid, { data: flatData, columns });

    const expandBtn = screen.getByRole("button", { name: "Expand branch" });
    await fireEvent.click(expandBtn);

    expect(screen.getByText("Design Phase")).toBeInTheDocument();
    expect(screen.getByText("Development Phase")).toBeInTheDocument();
  });

  it("filters tree items while preserving parent hierarchy", async () => {
    render(TreeGrid, { data: flatData, columns, defaultExpanded: true });

    const searchInput = screen.getByLabelText("Search tree grid");
    await fireEvent.input(searchInput, { target: { value: "Frontend" } });

    // Project Alpha & Development Phase should remain as ancestors, Design Phase excluded
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Development Phase")).toBeInTheDocument();
    expect(screen.getByText("Frontend Setup")).toBeInTheDocument();
    expect(screen.queryByText("Design Phase")).not.toBeInTheDocument();
  });

  it("supports cascading selection when selectable is enabled", async () => {
    const onSelection = vi.fn();
    render(TreeGrid, {
      data: flatData,
      columns,
      selectable: true,
      defaultExpanded: true,
      onSelectionChange: onSelection,
    });

    const checkboxes = screen.getAllByRole("checkbox");
    // [0] is header select all, [1] is Project Alpha
    await fireEvent.click(checkboxes[1]);

    expect(onSelection).toHaveBeenCalled();
    const [selectedSet] = onSelection.mock.calls[0];
    // Selecting Project Alpha should select all descendants
    expect(selectedSet.has("1")).toBe(true);
    expect(selectedSet.has("2")).toBe(true);
    expect(selectedSet.has("3")).toBe(true);
    expect(selectedSet.has("4")).toBe(true);
  });
});
