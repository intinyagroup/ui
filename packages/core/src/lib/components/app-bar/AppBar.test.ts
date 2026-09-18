import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import { createRawSnippet } from "svelte";
import AppBar from "./app-bar.svelte";
import AppBarTitle from "./app-bar-title.svelte";
import AppBarSection from "./app-bar-section.svelte";
import AppBarAction from "./app-bar-action.svelte";
function textSnippet(text: string) {
  return createRawSnippet(() => ({
    render: () => `<span>${text}</span>`,
  }));
}

describe("AppBar", () => {
  it("renders banner role and default attributes", () => {
    render(AppBar, {
      title: "Dashboard",
    });
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-slot", "app-bar");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders title element with custom heading level", () => {
    render(AppBarTitle, {
      level: 2,
      children: textSnippet("Page Title"),
    });
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Page Title");
  });

  it("renders section with alignment", () => {
    render(AppBarSection, {
      align: "end",
      children: textSnippet("End Actions"),
    });
    const section = screen
      .getByText("End Actions")
      .closest('[data-slot="app-bar-section"]');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("data-align", "end");
  });

  it("renders action with shortcut and disabled state", () => {
    render(AppBarAction, {
      title: "Save",
      shortcut: "Ctrl+S",
      disabled: true,
      children: textSnippet("Save"),
    });
    const btn = screen.getByRole("button", { name: /save/i });
    expect(btn).toBeDisabled();
  });
});
