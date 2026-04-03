"use client";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { getCategoryByValue } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Database } from "@/types/database";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

export function RecentTransactions({
  transactions,
  loading,
}: RecentTransactionsProps) {
  if (loading) {
    return (
      <div className="rounded-xl bg-bg-card border border-border p-4 space-y-3">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-bg-card border border-border p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        รายการล่าสุด
      </h3>
      {transactions.length === 0 ? (
        <p className="text-text-secondary text-sm text-center py-4">
          ยังไม่มีรายการ
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const cat = getCategoryByValue(tx.category);
            const Icon = cat?.icon;
            const isIncome = tx.type === "income";
            return (
              <div key={tx.id} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${cat?.color || "#64748b"}20`,
                  }}
                >
                  {Icon ? (
                    <Icon
                      className="w-5 h-5"
                      style={{ color: cat?.color }}
                    />
                  ) : isIncome ? (
                    <ArrowUpRight className="w-5 h-5 text-success" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {cat?.label || tx.category}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {tx.note || formatDateShort(tx.date)}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${isIncome ? "text-success" : "text-danger"}`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
