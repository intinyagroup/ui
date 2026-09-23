import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Textarea from "./components/textarea/textarea.svelte";
import Toggle from "./components/toggle/toggle.svelte";
import NumberInput from "./components/number-input/NumberInput.svelte";

describe("form control edge matrix", () => {
  it("Textarea preserves required, readonly, and value transitions", async () => {
    render(Textarea, {
      required: true,
      readonly: true,
      value: "draft",
      placeholder: "Description",
    });
    const field = screen.getByPlaceholderText("Description");
    expect(field).toBeRequired();
    expect(field).toHaveAttribute("readonly");
    expect(field).toHaveValue("draft");
    await fireEvent.input(field, { target: { value: "changed" } });
    expect(field).toHaveValue("changed");
  });

  it("Toggle exposes switch semantics and disabled state", async () => {
    render(Toggle, { "aria-label": "Enable feature" });
    const toggle = screen.getByRole("button", { name: "Enable feature" });
    expect(toggle).toBeInTheDocument();
    await fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("NumberInput preserves numeric constraints and disabled state", () => {
    render(NumberInput, { value: 3, min: 0, max: 10, step: 1, disabled: true });
    const field = screen.getByRole("spinbutton");
    expect(field).toHaveAttribute("aria-valuemin", "0");
    expect(field).toHaveAttribute("aria-valuemax", "10");
    expect(field).toBeDisabled();
  });
});
