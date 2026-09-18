import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import InputMask from "./InputMask.svelte";

describe("InputMask", () => {
  it("renders with formatted value for phone mask", () => {
    render(InputMask, {
      mask: "(000) 000-0000",
      value: "1234567890",
      "aria-label": "Phone",
    });

    const input = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(input.value).toBe("(123) 456-7890");
  });

  it("rejects invalid characters according to tokens", async () => {
    render(InputMask, {
      mask: "00/00/0000",
      "aria-label": "Date",
    });

    const input = screen.getByLabelText("Date") as HTMLInputElement;
    await fireEvent.input(input, { target: { value: "12ab34cd5678" } });

    expect(input.value).toBe("12/34/5678");
  });

  it("handles alphanumeric mask tokens correctly", async () => {
    render(InputMask, {
      mask: "AAA-***",
      "aria-label": "Code",
    });

    const input = screen.getByLabelText("Code") as HTMLInputElement;
    await fireEvent.input(input, { target: { value: "ab1cd9" } });

    // A token should reject '1', accept 'c' and 'd'
    expect(input.value).toBe("abc-d9");
  });

  it("handles backspace and deletion cleanly", async () => {
    render(InputMask, {
      mask: "(000) 000-0000",
      value: "123456",
      "aria-label": "Phone",
    });

    const input = screen.getByLabelText("Phone") as HTMLInputElement;
    expect(input.value).toBe("(123) 456");

    await fireEvent.input(input, { target: { value: "(123) 45" } });
    expect(input.value).toBe("(123) 45");
  });

  it("supports placeholder and passes label and aria props", () => {
    render(InputMask, {
      mask: "000-00",
      placeholder: "123-45",
      "aria-label": "Custom ID",
      "aria-required": "true",
      name: "custom-id",
    });

    const input = screen.getByLabelText("Custom ID") as HTMLInputElement;
    expect(input.placeholder).toBe("123-45");
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.name).toBe("custom-id");
    expect(input.getAttribute("data-slot")).toBe("input-mask");
  });

  it("respects disabled state", () => {
    render(InputMask, {
      mask: "000",
      disabled: true,
      "aria-label": "Disabled mask",
    });

    const input = screen.getByLabelText("Disabled mask") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("fires input and raw value callbacks", async () => {
    const handleInput = vi.fn();
    const handleRaw = vi.fn();

    render(InputMask, {
      mask: "00-00",
      oninput: handleInput,
      onrawvaluechange: handleRaw,
      "aria-label": "Callback mask",
    });

    const input = screen.getByLabelText("Callback mask") as HTMLInputElement;
    await fireEvent.input(input, { target: { value: "9876" } });

    expect(handleInput).toHaveBeenCalledTimes(1);
    expect(handleRaw).toHaveBeenCalledWith("9876");
    expect(input.value).toBe("98-76");
  });

  it("fires blur callback", async () => {
    const handleBlur = vi.fn();

    render(InputMask, {
      mask: "000",
      onblur: handleBlur,
      "aria-label": "Blur mask",
    });

    const input = screen.getByLabelText("Blur mask") as HTMLInputElement;
    await fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});
