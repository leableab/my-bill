"use client";

import { getCategoryByValue } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { Trash2 } from "lucide-react";

interface BudgetCardProps {
  category: string;
  monthlyLimit: number;
  spent: number;
  percentage: number;
  onDelete: () => void;
}

export function BudgetCard({ category, monthlyLimit, spent, percentage, onDelete }: BudgetCardProps) {
  const cat = getCategoryByValue(category);
  const Icon = cat?.icon;
  const cappedPercentage = Math.min(percentage, 100);

  const getStatusColor = () => {
    if (percentage >= 100) return "#ef4444";
    if (percentage >= 80) return "#f59e0b";
    return "#22c55e";
  };

  const getProgressFill = () => {
    if (percentage >= 100) return "#ef4444";
    if (percentage >= 80) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div
      style={{
        background: "#131320",
        border: "1px solid #2a2a4a",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${cat?.color || "#64748b"}20`,
            }}
          >
            {Icon && <Icon style={{ width: 20, height: 20, color: cat?.color }} />}
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#f1f5f9" }}>{cat?.label || category}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              {formatCurrency(spent)} / {formatCurrency(monthlyLimit)}
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          style={{
            padding: "8px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Trash2 style={{ width: 16, height: 16, color: "#94a3b8" }} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {/* Progress bar */}
        <div
          style={{
            height: "6px",
            background: "#1a1a2e",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${cappedPercentage}%`,
              background: getProgressFill(),
              borderRadius: "3px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 500, color: getStatusColor() }}>
            {percentage.toFixed(0)}%
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            เหลือ {formatCurrency(Math.max(monthlyLimit - spent, 0))}
          </span>
        </div>
      </div>

      {percentage >= 80 && percentage < 100 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(245,158,11,0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          <span style={{ color: "#f59e0b", fontSize: "12px" }}>ใกล้ถึงงบประมาณแล้ว</span>
        </div>
      )}
      {percentage >= 100 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(239,68,68,0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          <span style={{ color: "#ef4444", fontSize: "12px" }}>เกินงบประมาณแล้ว!</span>
        </div>
      )}
    </div>
  );
}
