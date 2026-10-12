import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import DialogBody from "./dialog-body.svelte";
import DialogHeader from "./dialog-header.svelte";
import DialogFooter from "./dialog-footer.svelte";

describe("Dialog Scrollable Body and Pinned Header/Footer", () => {
  it("renders DialogBody with scrollable overflow and flex container classes", () => {
    const { container } = render(DialogBody, {
      props: {},
    });
    const el = container.querySelector('[data-slot="dialog-body"]');
    expect(el).not.toBeNull();
    expect(el?.classList.contains("overflow-y-auto")).toBe(true);
    expect(el?.classList.contains("flex-1")).toBe(true);
    expect(el?.classList.contains("min-h-0")).toBe(true);
  });

  it("renders DialogHeader with shrink-0 class to pin at top", () => {
    const { container } = render(DialogHeader, {
      props: {},
    });
    const el = container.querySelector('[data-slot="dialog-header"]');
    expect(el).not.toBeNull();
    expect(el?.classList.contains("shrink-0")).toBe(true);
  });

  it("renders DialogFooter with shrink-0 and mt-auto to pin at bottom", () => {
    const { container } = render(DialogFooter, {
      props: {},
    });
    const el = container.querySelector('[data-slot="dialog-footer"]');
    expect(el).not.toBeNull();
    expect(el?.classList.contains("shrink-0")).toBe(true);
    expect(el?.classList.contains("mt-auto")).toBe(true);
  });
});
