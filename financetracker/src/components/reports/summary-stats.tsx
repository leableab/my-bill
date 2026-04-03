"use client";

import { formatCurrency } from "@/lib/format";
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
      color: "#22c55e",
      bgColor: "rgba(34,197,94,0.2)",
    },
    {
      label: "รายจ่าย",
      value: expense,
      icon: TrendingDown,
      color: "#ef4444",
      bgColor: "rgba(239,68,68,0.2)",
    },
    {
      label: "เงินออม",
      value: net,
      icon: PiggyBank,
      color: net >= 0 ? "#a855f7" : "#ef4444",
      bgColor: net >= 0 ? "rgba(168,85,247,0.2)" : "rgba(239,68,68,0.2)",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: "#131320",
            border: "1px solid #2a2a4a",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: stat.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
            }}
          >
            <stat.icon style={{ width: 16, height: 16, color: stat.color }} />
          </div>
          <p style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "4px" }}>{stat.label}</p>
          {loading ? (
            <div
              style={{
                height: "16px",
                width: "64px",
                margin: "0 auto",
                background: "#1a1a2e",
                borderRadius: "8px",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          ) : (
            <p style={{ fontSize: "14px", fontWeight: "bold", color: stat.color }}>
              {formatCurrency(stat.value)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
