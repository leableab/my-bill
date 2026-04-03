"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

interface MonthlyChartProps {
  data: { month: string; income: number; expense: number }[];
  loading: boolean;
}

export function MonthlyChart({ data, loading }: MonthlyChartProps) {
  if (loading) {
    return (
      <div className="rounded-xl bg-bg-card border border-border p-4">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-bg-card border border-border p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        รายรับ-รายจ่าย 6 เดือน
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e1e3a"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={50}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
            }
          />
          <Tooltip
            contentStyle={{
              background: "#131320",
              border: "1px solid #1e1e3a",
              borderRadius: 8,
              color: "#f1f5f9",
            }}
            formatter={(value, name) => [
              formatCurrency(value as number),
              name === "income" ? "รายรับ" : "รายจ่าย",
            ]}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Bar
            dataKey="income"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            barSize={16}
            name="income"
          />
          <Bar
            dataKey="expense"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            barSize={16}
            name="expense"
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-sm bg-success" />
          <span className="text-text-secondary">รายรับ</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-sm bg-danger" />
          <span className="text-text-secondary">รายจ่าย</span>
        </div>
      </div>
    </div>
  );
}
