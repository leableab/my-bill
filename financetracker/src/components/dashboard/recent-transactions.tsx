"use client";

import { formatCurrency, formatDateShort } from "@/lib/format";
import { getCategoryByValue } from "@/lib/constants";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Database } from "@/types/database";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  if (loading) {
    return (
      <div className="rounded-xl p-4" style={{ background: "#131320", border: "1px solid #2a2a4a" }}>
        <div className="h-5 w-32 mb-4 rounded animate-pulse" style={{ background: "#1a1a2e" }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-full animate-pulse" style={{ background: "#1a1a2e" }} />
            <div className="flex-1">
              <div className="h-4 w-24 mb-1 rounded animate-pulse" style={{ background: "#1a1a2e" }} />
              <div className="h-3 w-16 rounded animate-pulse" style={{ background: "#1a1a2e" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4" style={{ background: "#131320", border: "1px solid #2a2a4a" }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: "#f1f5f9" }}>รายการล่าสุด</h3>
      {transactions.length === 0 ? (
        <p className="text-center py-6" style={{ color: "#94a3b8", fontSize: "14px" }}>ยังไม่มีรายการ</p>
      ) : (
        <div className="space-y-1">
          {transactions.map((tx) => {
            const cat = getCategoryByValue(tx.category);
            const Icon = cat?.icon;
            const isIncome = tx.type === "income";
            return (
              <div key={tx.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat?.color || "#64748b"}20` }}
                >
                  {Icon ? (
                    <Icon className="w-5 h-5" style={{ color: cat?.color }} />
                  ) : isIncome ? (
                    <ArrowUpRight className="w-5 h-5" style={{ color: "#22c55e" }} />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" style={{ color: "#ef4444" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#f1f5f9" }}>{cat?.label || tx.category}</p>
                  <p className="text-xs truncate" style={{ color: "#64748b" }}>{tx.note || formatDateShort(tx.date)}</p>
                </div>
                <p className="text-sm font-semibold shrink-0" style={{ color: isIncome ? "#22c55e" : "#ef4444" }}>
                  {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
