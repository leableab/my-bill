"use client";

import { useState } from "react";
import { useMonthlyReport } from "@/hooks/use-monthly-summary";
import { SummaryStats } from "@/components/reports/summary-stats";
import { MonthlyChart } from "@/components/reports/monthly-chart";
import { CsvExport } from "@/components/reports/csv-export";
import { getCategoryByValue } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { MONTHS_TH } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const {
    currentIncome,
    currentExpense,
    currentNet,
    monthlyData,
    categoryData,
    loading,
  } = useMonthlyReport(month, year);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1 style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: "bold" }}>รายงาน</h1>

      {/* Month selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={prevMonth}
          style={{
            padding: "8px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ChevronLeft style={{ width: 20, height: 20, color: "#94a3b8" }} />
        </button>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#f1f5f9" }}>
          {MONTHS_TH[month]} {year + 543}
        </h2>
        <button
          onClick={nextMonth}
          style={{
            padding: "8px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ChevronRight style={{ width: 20, height: 20, color: "#94a3b8" }} />
        </button>
      </div>

      {/* Summary Stats */}
      <SummaryStats
        income={currentIncome}
        expense={currentExpense}
        net={currentNet}
        loading={loading}
      />

      {/* Bar Chart */}
      <MonthlyChart data={monthlyData} loading={loading} />

      {/* Category Breakdown */}
      <div
        style={{
          background: "#131320",
          border: "1px solid #2a2a4a",
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9", marginBottom: "12px" }}>
          รายจ่ายตามหมวดหมู่
        </h3>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "32px",
                  background: "#1a1a2e",
                  borderRadius: "8px",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
            ))}
          </div>
        ) : categoryData.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", padding: "16px 0" }}>
            ไม่มีข้อมูล
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {categoryData.map((cat) => {
              const info = getCategoryByValue(cat.category);
              const Icon = info?.icon;
              return (
                <div key={cat.category} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      backgroundColor: `${cat.color}20`,
                    }}
                  >
                    {Icon && (
                      <Icon style={{ width: 16, height: 16, color: cat.color }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#f1f5f9" }}>
                        {cat.label}
                      </span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {cat.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "#1a1a2e",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "3px",
                          transition: "width 0.3s ease",
                          width: `${Math.min(cat.percentage, 100)}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#f1f5f9", flexShrink: 0 }}>
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CSV Export */}
      <CsvExport month={month} year={year} />
    </div>
  );
}
