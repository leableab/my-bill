"use client";

import dynamic from "next/dynamic";
import { getCategoryByValue } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });

interface DonutChartProps {
  data: { category: string; amount: number; color: string }[];
  loading: boolean;
}

export function DonutChart({ data, loading }: DonutChartProps) {
  if (loading) {
    return (
      <div className="rounded-xl p-4" style={{ background: "#131320", border: "1px solid #2a2a4a" }}>
        <div className="h-5 w-32 mb-4 rounded animate-pulse" style={{ background: "#1a1a2e" }} />
        <div className="h-48 w-48 rounded-full mx-auto animate-pulse" style={{ background: "#1a1a2e" }} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ background: "#131320", border: "1px solid #2a2a4a" }}>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>ยังไม่มีข้อมูลรายจ่ายเดือนนี้</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="rounded-xl p-4" style={{ background: "#131320", border: "1px solid #2a2a4a" }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: "#f1f5f9" }}>สัดส่วนรายจ่าย</h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="amount" nameKey="category">
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const item = payload[0];
                const cat = getCategoryByValue(item.name as string);
                return (
                  <div className="rounded-lg px-3 py-2" style={{ background: "#1a1a2e", border: "1px solid #2a2a4a" }}>
                    <p className="text-sm font-medium" style={{ color: "#f1f5f9" }}>{cat?.label || item.name}</p>
                    <p className="text-sm" style={{ color: "#a855f7" }}>{formatCurrency(item.value as number)}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-2">
          {data.map((item) => {
            const cat = getCategoryByValue(item.category);
            const pct = ((item.amount / total) * 100).toFixed(0);
            return (
              <div key={item.category} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate" style={{ color: "#94a3b8" }}>{cat?.label || item.category}</span>
                <span className="ml-auto font-medium" style={{ color: "#f1f5f9" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
