import { format } from "date-fns";
import { enGB, enUS, id } from "date-fns/locale";

export type CalendarDateParts = {
  year: number;
  month: number;
  day: number;
};

function resolveLocale(locale: string) {
  if (locale.toLowerCase().startsWith("id")) return id;
  if (locale.toLowerCase() === "en-gb") return enGB;
  return enUS;
}

export function formatCalendarDate(
  value: CalendarDateParts,
  pattern: string,
  locale: string,
): string {
  const date = new Date(value.year, value.month, value.day);
  return format(date, pattern, { locale: resolveLocale(locale) });
}
