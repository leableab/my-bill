import { format } from "date-fns";
import { th } from "date-fns/locale";

export function formatCurrency(amount: number): string {
  return `฿${Math.abs(amount).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMM yyyy", { locale: th });
}

export function formatDateFull(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy", { locale: th });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMM", { locale: th });
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMMM yyyy", { locale: th });
}

export function getMonthRange(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  };
}

export function toISODateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
