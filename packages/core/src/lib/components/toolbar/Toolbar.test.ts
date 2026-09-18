import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import { createRawSnippet } from "svelte";
import Toolbar from "./toolbar.svelte";
import ToolbarGroup from "./toolbar-group.svelte";
import ToolbarItem from "./toolbar-item.svelte";
import ToolbarSeparator from "./toolbar-separator.svelte";
import ToolbarOverflow from "./toolbar-overflow.svelte";
import { createToolbarOverflow } from "./use-toolbar-overflow.svelte.js";

function textSnippet(text: string) {
  return createRawSnippet(() => ({
    render: () => `<span>${text}</span>`,
  }));
}
describe("Toolbar", () => {
  it("renders with role toolbar and orientation attribute", () => {
    render(Toolbar, {
      orientation: "horizontal",
      children: textSnippet("Content"),
    });
    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute("data-orientation", "horizontal");
    expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders items with pressed state and shortcut metadata", () => {
    render(ToolbarItem, {
      pressed: true,
      shortcut: "Ctrl+B",
      children: textSnippet("Bold"),
    });
    const item = screen.getByRole("button", { name: /bold/i });
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute("aria-pressed", "true");
    expect(item).toHaveAttribute("data-pressed", "true");
    expect(screen.getByText("Ctrl+B")).toBeInTheDocument();
  });

  it("supports disabled state on items", () => {
    render(ToolbarItem, {
      disabled: true,
      children: textSnippet("Italic"),
    });
    const item = screen.getByRole("button", { name: /italic/i });
    expect(item).toBeDisabled();
  });

  it("renders group with role group and label", () => {
    render(ToolbarGroup, {
      label: "Formatting",
      children: textSnippet("GroupContent"),
    });
    const group = screen.getByRole("group", { name: "Formatting" });
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("data-slot", "toolbar-group");
  });

  it("renders separator with correct semantics", () => {
    render(ToolbarSeparator, {
      orientation: "vertical",
    });
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("toggles overflow popup on click", async () => {
    render(ToolbarOverflow, {
      label: "More options",
      children: textSnippet("HiddenAction"),
    });
    const btn = screen.getByRole("button", { name: "More options" });
    expect(screen.queryByText("HiddenAction")).not.toBeInTheDocument();
    await fireEvent.click(btn);
    expect(screen.getByText("HiddenAction")).toBeInTheDocument();
  });

  it("manages overflow hook state", () => {
    const overflow = createToolbarOverflow({ initialVisible: 4 });
    expect(overflow.visibleCount).toBe(4);
    expect(overflow.hasOverflow).toBe(false);
    overflow.visibleCount = 2;
    expect(overflow.visibleCount).toBe(2);
  });
});
