"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryByValue } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

interface DonutChartProps {
  data: { category: string; amount: number; color: string }[];
  loading: boolean;
}

export function DonutChart({ data, loading }: DonutChartProps) {
  if (loading) {
    return (
      <div className="rounded-xl bg-bg-card border border-border p-4">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-48 w-48 rounded-full mx-auto" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-bg-card border border-border p-6 text-center">
        <p className="text-text-secondary text-sm">
          ยังไม่มีข้อมูลรายจ่ายเดือนนี้
        </p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="rounded-xl bg-bg-card border border-border p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        สัดส่วนรายจ่าย
      </h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const item = payload[0];
                const cat = getCategoryByValue(item.name as string);
                return (
                  <div className="bg-bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-text-primary text-sm font-medium">
                      {cat?.label || item.name}
                    </p>
                    <p className="text-accent text-sm">
                      {formatCurrency(item.value as number)}
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 w-full mt-2">
          {data.map((item) => {
            const cat = getCategoryByValue(item.category);
            const pct = ((item.amount / total) * 100).toFixed(0);
            return (
              <div
                key={item.category}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text-secondary truncate">
                  {cat?.label || item.category}
                </span>
                <span className="text-text-primary ml-auto font-medium">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
