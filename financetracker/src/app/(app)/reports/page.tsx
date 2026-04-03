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
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-text-primary">รายงาน</h1>

      {/* Month selector */}
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
      <div className="rounded-xl bg-bg-card border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          รายจ่ายตามหมวดหมู่
        </h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-bg-input rounded animate-pulse" />
            ))}
          </div>
        ) : categoryData.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-4">
            ไม่มีข้อมูล
          </p>
        ) : (
          <div className="space-y-3">
            {categoryData.map((cat) => {
              const info = getCategoryByValue(cat.category);
              const Icon = info?.icon;
              return (
                <div key={cat.category} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {Icon && (
                      <Icon
                        className="w-4 h-4"
                        style={{ color: cat.color }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-text-primary">
                        {cat.label}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {cat.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-bg-input rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(cat.percentage, 100)}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-text-primary shrink-0">
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
