"use client";

import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

interface SummaryStatsProps {
  income: number;
  expense: number;
  net: number;
  loading: boolean;
}

export function SummaryStats({
  income,
  expense,
  net,
  loading,
}: SummaryStatsProps) {
  const stats = [
    {
      label: "รายรับ",
      value: income,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/20",
    },
    {
      label: "รายจ่าย",
      value: expense,
      icon: TrendingDown,
      color: "text-danger",
      bgColor: "bg-danger/20",
    },
    {
      label: "เงินออม",
      value: net,
      icon: PiggyBank,
      color: net >= 0 ? "text-accent" : "text-danger",
      bgColor: net >= 0 ? "bg-accent/20" : "bg-danger/20",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-bg-card border border-border p-3 text-center"
        >
          <div
            className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}
          >
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="text-[10px] text-text-secondary mb-1">{stat.label}</p>
          {loading ? (
            <Skeleton className="h-4 w-16 mx-auto" />
          ) : (
            <p className={`text-sm font-bold ${stat.color}`}>
              {formatCurrency(stat.value)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
