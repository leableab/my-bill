"use client";

import dynamic from "next/dynamic";
import { formatCurrency } from "@/lib/format";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });

interface MonthlyChartProps {
  data: { month: string; income: number; expense: number }[];
  loading: boolean;
}

export function MonthlyChart({ data, loading }: MonthlyChartProps) {
  if (loading) {
    return (
      <div
        style={{
          background: "#131320",
          border: "1px solid #2a2a4a",
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        <div
          style={{
            height: "20px",
            width: "160px",
            background: "#1a1a2e",
            borderRadius: "10px",
            marginBottom: "16px",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
        <div
          style={{
            height: "208px",
            width: "100%",
            background: "#1a1a2e",
            borderRadius: "12px",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#131320",
        border: "1px solid #2a2a4a",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9", marginBottom: "16px" }}>
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
              border: "1px solid #2a2a4a",
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
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "2px", background: "#22c55e" }} />
          <span style={{ color: "#94a3b8" }}>รายรับ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "2px", background: "#ef4444" }} />
          <span style={{ color: "#94a3b8" }}>รายจ่าย</span>
        </div>
      </div>
    </div>
  );
}
