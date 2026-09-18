import { render, screen, fireEvent, within } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import FileManager from "./components/FileManager.svelte";
import type { FileItem } from "./file-model.js";

describe("FileManager", () => {
  const mockItems: FileItem[] = [
    { id: "1", name: "Documents", type: "folder", parentId: null },
    { id: "2", name: "Photos", type: "folder", parentId: null },
    {
      id: "3",
      name: "Report.pdf",
      type: "file",
      parentId: null,
      size: 2048576,
      extension: "pdf",
    },
    {
      id: "4",
      name: "Project Plan.docx",
      type: "file",
      parentId: "1",
      size: 524288,
      extension: "docx",
    },
  ];

  it("renders toolbar, folder tree, and root items", () => {
    render(FileManager, { items: mockItems });

    expect(
      screen.getByRole("tree", { name: "Folder Navigation Tree" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Search files")).toBeInTheDocument();
    expect(screen.getByText("New Folder")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();

    const gridEl = document.querySelector(
      '[data-slot="file-view-grid"]',
    ) as HTMLElement;
    const grid = within(gridEl);
    expect(grid.getByText("Documents")).toBeInTheDocument();
    expect(grid.getByText("Photos")).toBeInTheDocument();
    expect(grid.getByText("Report.pdf")).toBeInTheDocument();
    expect(grid.queryByText("Project Plan.docx")).not.toBeInTheDocument();
  });

  it("switches to list view when list button clicked", async () => {
    render(FileManager, { items: mockItems });

    const listBtn = screen.getByRole("button", { name: "Switch to list view" });
    await fireEvent.click(listBtn);

    expect(screen.getByText("Modified")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Name/ }),
    ).toBeInTheDocument();
  });

  it("navigates into a folder on double click", async () => {
    const onNavigate = vi.fn();
    render(FileManager, { items: mockItems, onNavigate });

    const gridEl = document.querySelector(
      '[data-slot="file-view-grid"]',
    ) as HTMLElement;
    const folderCard = within(gridEl).getByText("Documents");
    await fireEvent.dblClick(folderCard);

    expect(onNavigate).toHaveBeenCalledWith("1");
    // After navigating inside Documents (id: "1"), Project Plan.docx should be rendered
    const updatedGrid = within(
      document.querySelector('[data-slot="file-view-grid"]') as HTMLElement,
    );
    expect(updatedGrid.getByText("Project Plan.docx")).toBeInTheDocument();
  });

  it("supports file search filtering within current folder", async () => {
    render(FileManager, { items: mockItems });

    const searchInput = screen.getByLabelText("Search files");
    await fireEvent.input(searchInput, { target: { value: "Report" } });

    const gridEl = document.querySelector(
      '[data-slot="file-view-grid"]',
    ) as HTMLElement;
    const grid = within(gridEl);
    expect(grid.getByText("Report.pdf")).toBeInTheDocument();
    expect(grid.queryByText("Photos")).not.toBeInTheDocument();
  });
});
