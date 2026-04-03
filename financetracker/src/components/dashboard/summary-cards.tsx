"use client";

import { formatCurrency } from "@/lib/format";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardsProps {
  income: number;
  expense: number;
  loading: boolean;
}

export function SummaryCards({ income, expense, loading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl p-4" style={{ background: "#131320", border: "1px solid #1a3a2a" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(34, 197, 94, 0.15)" }}>
            <TrendingUp className="w-4 h-4" style={{ color: "#22c55e" }} />
          </div>
          <span style={{ color: "#94a3b8", fontSize: "12px" }}>รายรับ</span>
        </div>
        {loading ? (
          <div className="h-7 w-24 rounded animate-pulse" style={{ background: "#1a1a2e" }} />
        ) : (
          <p className="text-xl font-bold" style={{ color: "#22c55e" }}>{formatCurrency(income)}</p>
        )}
      </div>
      <div className="rounded-xl p-4" style={{ background: "#131320", border: "1px solid #3a1a1a" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(239, 68, 68, 0.15)" }}>
            <TrendingDown className="w-4 h-4" style={{ color: "#ef4444" }} />
          </div>
          <span style={{ color: "#94a3b8", fontSize: "12px" }}>รายจ่าย</span>
        </div>
        {loading ? (
          <div className="h-7 w-24 rounded animate-pulse" style={{ background: "#1a1a2e" }} />
        ) : (
          <p className="text-xl font-bold" style={{ color: "#ef4444" }}>{formatCurrency(expense)}</p>
        )}
      </div>
    </div>
  );
}
