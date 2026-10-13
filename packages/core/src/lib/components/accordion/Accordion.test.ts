import { render } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import Accordion from "./accordion.svelte";

describe("Accordion", () => {
  it("renders accordion structure properly", () => {
    const { container } = render(Accordion);
    expect(
      container.querySelector('[data-slot="accordion"]'),
    ).toBeInTheDocument();
  });
});
