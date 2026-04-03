"use client";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardsProps {
  income: number;
  expense: number;
  loading: boolean;
}

export function SummaryCards({ income, expense, loading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-bg-card border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <span className="text-text-secondary text-xs">รายรับ</span>
        </div>
        {loading ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <p className="text-lg font-bold text-success">
            {formatCurrency(income)}
          </p>
        )}
      </div>
      <div className="rounded-xl bg-bg-card border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-danger" />
          </div>
          <span className="text-text-secondary text-xs">รายจ่าย</span>
        </div>
        {loading ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <p className="text-lg font-bold text-danger">
            {formatCurrency(expense)}
          </p>
        )}
      </div>
    </div>
  );
}
