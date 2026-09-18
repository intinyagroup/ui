import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import ListBox from "./ListBox.svelte";

const sampleOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry", hidden: true },
];

describe("ListBox", () => {
  it("renders listbox role and visible options", () => {
    render(ListBox, { options: sampleOptions });
    const listbox = screen.getByRole("listbox", { name: "List box" });
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4); // elderberry is hidden
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Elderberry")).not.toBeInTheDocument();
  });

  it("selects option on click in single-selection mode", async () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    render(ListBox, {
      options: sampleOptions,
      value: "apple",
      onChange,
      onSelect,
    });

    const banana = screen.getByText("Banana");
    await fireEvent.click(banana);

    expect(onChange).toHaveBeenCalledWith("banana");
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "banana", label: "Banana" }),
    );
  });

  it("toggles options in multiple-selection mode", async () => {
    const onChange = vi.fn();
    render(ListBox, {
      options: sampleOptions,
      multiple: true,
      value: ["apple"],
      onChange,
    });

    const banana = screen.getByText("Banana");
    await fireEvent.click(banana);
    expect(onChange).toHaveBeenCalledWith(["apple", "banana"]);
  });

  it("does not select disabled options on click", async () => {
    const onChange = vi.fn();
    render(ListBox, {
      options: sampleOptions,
      onChange,
    });

    const cherry = screen.getByText("Cherry");
    await fireEvent.click(cherry);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports keyboard navigation and skips disabled options", async () => {
    const onChange = vi.fn();
    render(ListBox, {
      options: sampleOptions,
      onChange,
    });

    const listbox = screen.getByRole("listbox");
    listbox.focus();

    // ArrowDown -> highlights Apple (index 0)
    await fireEvent.keyDown(listbox, { key: "ArrowDown" });
    // ArrowDown -> highlights Banana (index 1)
    await fireEvent.keyDown(listbox, { key: "ArrowDown" });
    // ArrowDown -> skips Cherry (disabled, index 2) -> highlights Date (index 3)
    await fireEvent.keyDown(listbox, { key: "ArrowDown" });

    // Enter selects highlighted Date
    await fireEvent.keyDown(listbox, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("date");
  });

  it("supports Home and End keys", async () => {
    const onChange = vi.fn();
    render(ListBox, {
      options: sampleOptions,
      onChange,
    });

    const listbox = screen.getByRole("listbox");
    listbox.focus();

    // End -> highlights Date (last enabled)
    await fireEvent.keyDown(listbox, { key: "End" });
    await fireEvent.keyDown(listbox, { key: " " });
    expect(onChange).toHaveBeenCalledWith("date");

    // Home -> highlights Apple (first enabled)
    await fireEvent.keyDown(listbox, { key: "Home" });
    await fireEvent.keyDown(listbox, { key: " " });
    expect(onChange).toHaveBeenCalledWith("apple");
  });

  it("supports typeahead search", async () => {
    const onChange = vi.fn();
    render(ListBox, {
      options: sampleOptions,
      onChange,
    });

    const listbox = screen.getByRole("listbox");
    listbox.focus();

    await fireEvent.keyDown(listbox, { key: "b" });
    await fireEvent.keyDown(listbox, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("renders grouped options with headers", () => {
    render(ListBox, {
      groups: [
        {
          label: "Fruits",
          options: [
            { value: "f1", label: "Orange" },
            { value: "f2", label: "Mango" },
          ],
        },
        {
          label: "Vegetables",
          options: [{ value: "v1", label: "Carrot" }],
        },
      ],
    });

    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Vegetables")).toBeInTheDocument();
    expect(screen.getByText("Orange")).toBeInTheDocument();
    expect(screen.getByText("Carrot")).toBeInTheDocument();
  });
});
