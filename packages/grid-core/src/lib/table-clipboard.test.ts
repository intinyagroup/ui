import { describe, it, expect } from "vitest";
import type { RowData, Table } from "@tanstack/table-core";
import { createClipboard } from "./table-clipboard.js";
import { coreFeatures } from "./table-core.js";

describe("table-clipboard", () => {
  const mockTable = {
    store: { state: { rowSelection: { "0": true } } },
    getRowModel: () => ({
      rows: [
        {
          id: "0",
          getValue: (colId: string) => `val-${colId}`,
        },
        {
          id: "1",
          getValue: (colId: string) => `val-${colId}-1`,
        },
      ],
    }),
    getVisibleLeafColumns: () => [
      { id: "name", getIsVisible: () => true, columnDef: { header: "Name" } },
      { id: "role", getIsVisible: () => true, columnDef: { header: "Role" } },
    ],
    getFilteredRowModel: () => ({
      rows: [{ id: "0", getValue: (colId: string) => `val-${colId}` }],
    }),
  } as unknown as Table<typeof coreFeatures, RowData>;

  it("gets selected cell data matrix properly", () => {
    const clip = createClipboard({ table: mockTable });
    const data = clip.getSelectedCellData();
    expect(data).toEqual([["val-name", "val-role"]]);
  });
});
