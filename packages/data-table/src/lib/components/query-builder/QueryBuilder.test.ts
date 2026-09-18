import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import QueryBuilder from "./QueryBuilder.svelte";
import type { FilterField } from "@intinyagroup/grid-core";

describe("QueryBuilder", () => {
  const sampleFields: FilterField[] = [
    { id: "name", label: "Name", type: "string" },
    { id: "age", label: "Age", type: "number" },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  it("renders with default initial rule", () => {
    render(QueryBuilder, { fields: sampleFields });

    expect(screen.getByText("Query Builder")).toBeInTheDocument();
    expect(screen.getByText("AND")).toBeInTheDocument();
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter field")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter operator")).toBeInTheDocument();
  });

  it("adds a new rule when + Rule is clicked", async () => {
    const onChange = vi.fn();
    render(QueryBuilder, { fields: sampleFields, onchange: onChange });

    const addRuleBtn = screen.getByRole("button", { name: /Rule/ });
    await fireEvent.click(addRuleBtn);

    const rules = screen.getAllByLabelText("Filter field");
    expect(rules).toHaveLength(2);
    expect(onChange).toHaveBeenCalled();
  });

  it("adds a nested group when + Group is clicked", async () => {
    const onChange = vi.fn();
    render(QueryBuilder, { fields: sampleFields, onchange: onChange });

    const addGroupBtn = screen.getByRole("button", { name: /Group/ });
    await fireEvent.click(addGroupBtn);

    const groups = document.querySelectorAll(
      '[data-slot="query-builder-group"]',
    );
    expect(groups.length).toBeGreaterThanOrEqual(2);
    expect(onChange).toHaveBeenCalled();
  });

  it("switches condition from AND to OR", async () => {
    const onChange = vi.fn();
    render(QueryBuilder, { fields: sampleFields, onchange: onChange });

    const orBtn = screen.getByRole("button", { name: "OR" });
    await fireEvent.click(orBtn);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ condition: "or" }),
      expect.anything(),
    );
  });

  it("toggles NOT negation on the group", async () => {
    const onChange = vi.fn();
    render(QueryBuilder, { fields: sampleFields, onchange: onChange });

    const notBtn = screen.getByRole("button", { name: "NOT" });
    await fireEvent.click(notBtn);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ not: true }),
      expect.anything(),
    );
  });

  it("toggles SQL preview display", async () => {
    render(QueryBuilder, { fields: sampleFields });

    expect(
      screen.queryByText(/Generated SQL WHERE Clause/i),
    ).not.toBeInTheDocument();

    const toggleSqlBtn = screen.getByRole("button", {
      name: "Toggle SQL preview",
    });
    await fireEvent.click(toggleSqlBtn);

    expect(screen.getByText(/Generated SQL WHERE Clause/i)).toBeInTheDocument();
  });
});
