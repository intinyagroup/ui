import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import Input from "./input.svelte";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(Input, { placeholder: "Enter text" });
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });
  it("renders as an input element", () => {
    render(Input);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
  it("handles value change", async () => {
    render(Input);
    const input = screen.getByRole("textbox");
    await fireEvent.input(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
  });
  it("renders as disabled", () => {
    render(Input, { disabled: true });
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
  it("has no explicit type by default", () => {
    render(Input);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("type");
  });
  it("renders password type", () => {
    render(Input, { type: "password" });
    expect(
      document.querySelector('input[type="password"]'),
    ).toBeInTheDocument();
  });
  it("renders email type", () => {
    render(Input, { type: "email" });
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });
  it("renders number type", () => {
    render(Input, { type: "number" });
    expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
  });
  it("renders tel type", () => {
    render(Input, { type: "tel" });
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
  });
  it("renders url type", () => {
    render(Input, { type: "url" });
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "url");
  });
  it("renders custom class", () => {
    render(Input, { class: "custom-input" });
    expect(screen.getByRole("textbox")).toHaveClass("custom-input");
  });
  it("renders default styling", () => {
    render(Input);
    expect(screen.getByRole("textbox")).toHaveClass(
      "h-8",
      "rounded-lg",
      "border",
      "w-full",
    );
  });
  it("renders data-slot", () => {
    render(Input);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
  });
  it("renders value prop", () => {
    render(Input, { value: "initial" });
    expect(screen.getByRole("textbox")).toHaveValue("initial");
  });
  it("renders readonly", () => {
    render(Input, { readonly: true });
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });
  it("renders aria-invalid", () => {
    render(Input, { "aria-invalid": true });
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
  it("does not disable when false", () => {
    render(Input, { disabled: false });
    expect(screen.getByRole("textbox")).not.toBeDisabled();
  });
  it("preserves required and readonly together", () => {
    render(Input, { required: true, readonly: true, placeholder: "Name" });
    const input = screen.getByPlaceholderText("Name");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("readonly");
  });
  it("supports form association and autocomplete", () => {
    render(Input, { id: "email", name: "email", autocomplete: "email" });
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
  });
});
