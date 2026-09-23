import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import MarkdownRenderer from "./MarkdownRenderer.svelte";

describe("MarkdownRenderer security boundary", () => {
  it("escapes raw HTML instead of rendering executable markup", () => {
    const { container } = render(MarkdownRenderer, {
      content: '<script>alert(1)</script><img onerror="alert(2)">',
    });
    expect(container.querySelector("script")).not.toBeInTheDocument();
    expect(container.innerHTML).toContain("&lt;script&gt;");
    expect(container.querySelector("[onerror]")).not.toBeInTheDocument();
  });

  it("blocks unsafe link protocols", () => {
    const { container } = render(MarkdownRenderer, {
      content: "[unsafe](javascript:alert(1))",
    });
    expect(container.querySelector("a")).toHaveAttribute("href", "#");
  });

  it("preserves safe external links with noopener protection", () => {
    const { container } = render(MarkdownRenderer, {
      content: "[safe](https://example.com)",
    });
    expect(container.querySelector("a")).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(container.querySelector("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
