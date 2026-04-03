"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { MONTHS_TH } from "@/lib/constants";

interface FilterBarProps {
  month: number;
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

  const types = [
    { value: "all" as const, label: "ทั้งหมด" },
    { value: "income" as const, label: "รายรับ" },
    { value: "expense" as const, label: "รายจ่าย" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#94a3b8" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-semibold" style={{ color: "#f1f5f9" }}>
          {MONTHS_TH[month]} {year + 543}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#94a3b8" }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Type Filter */}
      <div
        className="flex gap-1 rounded-xl"
        style={{ padding: "4px", background: "#1a1a2e" }}
      >
        {types.map((item) => (
          <button
            key={item.value}
            onClick={() => onTypeChange(item.value)}
            className="flex-1 rounded-lg text-sm font-medium transition-all"
            style={{
              padding: "10px 0",
              background: type === item.value ? "#a855f7" : "transparent",
              color: type === item.value ? "#fff" : "#94a3b8",
              boxShadow: type === item.value ? "0 2px 10px rgba(168, 85, 247, 0.3)" : "none",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center" style={{ gap: "10px" }}>
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#1a1a2e" }}
        >
          <Search style={{ width: "18px", height: "18px", color: "#64748b" }} />
        </div>
        <input
          placeholder="ค้นหาบันทึก..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="outline-none text-sm"
          style={{
            flex: 1,
            height: "44px",
            padding: "0 16px",
            borderRadius: "12px",
            background: "#1a1a2e",
            border: "1px solid #2a2a4a",
            color: "#f1f5f9",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#a855f7"; }}
          onBlur={(e) => { e.target.style.borderColor = "#2a2a4a"; }}
        />
      </div>
    </div>
  );
}
