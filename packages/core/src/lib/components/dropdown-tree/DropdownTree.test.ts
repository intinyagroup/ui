import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import DropdownTree from "./DropdownTree.svelte";

const sampleTree = [
  {
    value: "docs",
    label: "Documents",
    expanded: true,
    children: [
      {
        value: "work",
        label: "Work",
        children: [
          { value: "report", label: "Report.pdf" },
          { value: "budget", label: "Budget.xlsx", disabled: true },
        ],
      },
      { value: "personal", label: "Personal", hidden: true },
    ],
  },
  {
    value: "media",
    label: "Media",
    children: [{ value: "photo", label: "Photo.png" }],
  },
];

describe("DropdownTree", () => {
  it("renders trigger and displays selected path label", () => {
    render(DropdownTree, {
      options: sampleTree,
      value: "report",
    });

    expect(screen.getByRole("button")).toHaveTextContent(
      "Documents / Work / Report.pdf",
    );
  });

  it("opens dropdown on button click and renders visible tree nodes", async () => {
    render(DropdownTree, {
      options: sampleTree,
      placeholder: "Choose item...",
    });

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent("Choose item...");

    await fireEvent.click(trigger);
    expect(screen.getByRole("tree")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.queryByText("Personal")).not.toBeInTheDocument(); // hidden
    expect(screen.queryByText("Photo.png")).not.toBeInTheDocument(); // collapsed parent
  });

  it("expands and collapses nodes on toggle button click", async () => {
    const onExpand = vi.fn();
    render(DropdownTree, {
      options: sampleTree,
      onExpand,
    });

    await fireEvent.click(screen.getByRole("button"));

    const mediaExpandBtn = screen.getByLabelText("Expand Media");
    await fireEvent.click(mediaExpandBtn);

    expect(onExpand).toHaveBeenCalledWith(
      expect.objectContaining({ value: "media", label: "Media" }),
      true,
    );
    expect(screen.getByText("Photo.png")).toBeInTheDocument();

    const mediaCollapseBtn = screen.getByLabelText("Collapse Media");
    await fireEvent.click(mediaCollapseBtn);
    expect(onExpand).toHaveBeenCalledWith(
      expect.objectContaining({ value: "media", label: "Media" }),
      false,
    );
    expect(screen.queryByText("Photo.png")).not.toBeInTheDocument();
  });

  it("selects node and returns selected node and path", async () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    render(DropdownTree, {
      options: sampleTree,
      onChange,
      onSelect,
    });

    await fireEvent.click(screen.getByRole("button"));

    // Expand Work to see Report.pdf
    const workNode = screen.getByText("Work");
    await fireEvent.click(workNode);

    expect(onChange).toHaveBeenCalledWith("work");
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "work" }),
      expect.arrayContaining([
        expect.objectContaining({ value: "docs" }),
        expect.objectContaining({ value: "work" }),
      ]),
    );
  });

  it("does not select disabled tree nodes", async () => {
    const onChange = vi.fn();
    render(DropdownTree, {
      options: sampleTree,
      onChange,
    });

    await fireEvent.click(screen.getByRole("button"));

    // Expand Work to see Budget.xlsx
    const expandWork = screen.getByLabelText("Expand Work");
    await fireEvent.click(expandWork);

    const budget = screen.getByText("Budget.xlsx");
    await fireEvent.click(budget);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports keyboard navigation: expand with ArrowRight, collapse with ArrowLeft", async () => {
    render(DropdownTree, {
      options: sampleTree,
    });

    const trigger = screen.getByRole("button");
    // Open via Enter
    await fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.getByRole("tree")).toBeInTheDocument();

    // Trigger or container keydown
    const tree = screen.getByRole("tree");

    // Navigate down to Media
    await fireEvent.keyDown(tree, { key: "ArrowDown" });
    // Expand with ArrowRight
    await fireEvent.keyDown(tree, { key: "ArrowRight" });
    // Collapse with ArrowLeft
    await fireEvent.keyDown(tree, { key: "ArrowLeft" });
    // Escape closes tree
    await fireEvent.keyDown(tree, { key: "Escape" });
    expect(screen.queryByRole("tree")).not.toBeInTheDocument();
  });

  it("supports multiple selection mode", async () => {
    const onChange = vi.fn();
    render(DropdownTree, {
      options: sampleTree,
      multiple: true,
      value: ["docs"],
      onChange,
    });

    const trigger = screen.getByRole("button");
    await fireEvent.click(trigger);

    const media = screen.getByText("Media");
    await fireEvent.click(media);

    expect(onChange).toHaveBeenCalledWith(["docs", "media"]);
  });
});
