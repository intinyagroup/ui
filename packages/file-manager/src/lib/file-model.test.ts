import { describe, it, expect } from "vitest";
import {
  formatFileSize,
  getFileExtension,
  getFileCategory,
  buildBreadcrumbs,
  getChildrenInFolder,
  sortFileItems,
  filterFileItems,
  type FileItem,
} from "./file-model.js";

describe("file-model", () => {
  const sampleItems: FileItem[] = [
    { id: "1", name: "Documents", type: "folder", parentId: null },
    { id: "2", name: "Images", type: "folder", parentId: null },
    { id: "3", name: "Contracts", type: "folder", parentId: "1" },
    {
      id: "4",
      name: "agreement.pdf",
      type: "file",
      parentId: "3",
      size: 2048576,
      extension: "pdf",
    },
    {
      id: "5",
      name: "logo.png",
      type: "file",
      parentId: "2",
      size: 524288,
      extension: "png",
    },
    {
      id: "6",
      name: "notes.txt",
      type: "file",
      parentId: null,
      size: 1024,
      extension: "txt",
    },
  ];

  it("formats file sizes correctly", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1048576)).toBe("1 MB");
    expect(formatFileSize(1073741824)).toBe("1 GB");
    expect(formatFileSize(undefined)).toBe("-");
  });

  it("extracts extension correctly", () => {
    expect(getFileExtension("photo.jpeg")).toBe("jpeg");
    expect(getFileExtension("archive.tar.gz")).toBe("gz");
    expect(getFileExtension("noext")).toBe("");
  });

  it("classifies file categories correctly", () => {
    expect(getFileCategory({ type: "folder", name: "Docs" })).toBe("folder");
    expect(getFileCategory({ type: "file", name: "contract.pdf" })).toBe("pdf");
    expect(getFileCategory({ type: "file", name: "avatar.jpg" })).toBe("image");
    expect(getFileCategory({ type: "file", name: "video.mp4" })).toBe("video");
    expect(getFileCategory({ type: "file", name: "track.mp3" })).toBe("audio");
    expect(getFileCategory({ type: "file", name: "budget.xlsx" })).toBe(
      "spreadsheet",
    );
    expect(getFileCategory({ type: "file", name: "app.tsx" })).toBe("code");
    expect(getFileCategory({ type: "file", name: "bundle.zip" })).toBe(
      "archive",
    );
  });

  it("constructs accurate breadcrumbs", () => {
    // Breadcrumb for Contracts folder (id: "3") -> Home / Documents / Contracts
    const crumbs = buildBreadcrumbs(sampleItems, "3");
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0]).toEqual({ id: null, name: "Home" });
    expect(crumbs[1]).toEqual({ id: "1", name: "Documents" });
    expect(crumbs[2]).toEqual({ id: "3", name: "Contracts" });
  });

  it("gets children inside a folder", () => {
    const rootChildren = getChildrenInFolder(sampleItems, null);
    expect(rootChildren.map((i) => i.id)).toEqual(["1", "2", "6"]);

    const docChildren = getChildrenInFolder(sampleItems, "1");
    expect(docChildren.map((i) => i.id)).toEqual(["3"]);
  });

  it("sorts items with folders pinned to top", () => {
    const itemsToSort: FileItem[] = [
      { id: "a", name: "zebra.txt", type: "file", size: 100 },
      { id: "b", name: "apple.txt", type: "file", size: 500 },
      { id: "c", name: "Zebra Folder", type: "folder" },
      { id: "d", name: "Apple Folder", type: "folder" },
    ];

    const sorted = sortFileItems(itemsToSort, {
      field: "name",
      direction: "asc",
    });
    // Folders come first alphabetically, then files alphabetically
    expect(sorted.map((i) => i.name)).toEqual([
      "Apple Folder",
      "Zebra Folder",
      "apple.txt",
      "zebra.txt",
    ]);
  });

  it("filters items by name", () => {
    const matched = filterFileItems(sampleItems, "logo");
    expect(matched).toHaveLength(1);
    expect(matched[0].name).toBe("logo.png");
  });
});
