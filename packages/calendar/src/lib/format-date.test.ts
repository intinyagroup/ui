import { describe, expect, it } from "vitest";
import { formatCalendarDate } from "./format-date";

const sampleDate = { year: 2026, month: 10, day: 7 };

describe("formatCalendarDate", () => {
  it("supports day-first and month-first numeric formats", () => {
    expect(formatCalendarDate(sampleDate, "dd/MM/yyyy", "id-ID")).toBe(
      "07/11/2026",
    );
    expect(formatCalendarDate(sampleDate, "MM/dd/yyyy", "en-US")).toBe(
      "11/07/2026",
    );
  });

  it("formats month names using the requested locale", () => {
    expect(formatCalendarDate(sampleDate, "d MMMM yyyy", "id-ID")).toBe(
      "7 November 2026",
    );
    expect(formatCalendarDate(sampleDate, "d MMM yyyy", "en-GB")).toBe(
      "7 Nov 2026",
    );
  });
});
