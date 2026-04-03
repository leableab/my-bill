"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MONTHS_TH } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  month: number; // 0-11
  year: number;
  type: "all" | "income" | "expense";
  search: string;
  onMonthChange: (month: number, year: number) => void;
  onTypeChange: (type: "all" | "income" | "expense") => void;
  onSearchChange: (search: string) => void;
}

export function FilterBar({
  month,
  year,
  type,
  search,
  onMonthChange,
  onTypeChange,
  onSearchChange,
}: FilterBarProps) {
  const prevMonth = () => {
    if (month === 0) onMonthChange(11, year - 1);
    else onMonthChange(month - 1, year);
  };

  const nextMonth = () => {
    if (month === 11) onMonthChange(0, year + 1);
    else onMonthChange(month + 1, year);
  };

  return (
    <div className="space-y-3">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-bg-card transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h2 className="text-base font-semibold text-text-primary">
          {MONTHS_TH[month]} {year + 543}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-bg-card transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 p-1 bg-bg-input rounded-xl">
        {(
          [
            { value: "all", label: "ทั้งหมด" },
            { value: "income", label: "รายรับ" },
            { value: "expense", label: "รายจ่าย" },
          ] as const
        ).map((item) => (
          <button
            key={item.value}
            onClick={() => onTypeChange(item.value)}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
              type === item.value
                ? "bg-accent text-white shadow-lg"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <Input
          placeholder="ค้นหาบันทึก..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-bg-input border-border text-text-primary text-sm placeholder:text-text-secondary/50"
        />
      </div>
    </div>
  );
}
