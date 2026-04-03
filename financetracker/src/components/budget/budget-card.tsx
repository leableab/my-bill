"use client";

import { getCategoryByValue } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    if (percentage >= 100) return "text-danger";
    if (percentage >= 80) return "text-warning";
    return "text-success";
  };

  const getProgressColor = () => {
    if (percentage >= 100) return "[&>div]:bg-danger";
    if (percentage >= 80) return "[&>div]:bg-warning";
    return "[&>div]:bg-success";
  };

  return (
    <div className="rounded-xl bg-bg-card border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${cat?.color || "#64748b"}20` }}
          >
            {Icon && <Icon className="w-5 h-5" style={{ color: cat?.color }} />}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{cat?.label || category}</p>
            <p className="text-xs text-text-secondary">
              {formatCurrency(spent)} / {formatCurrency(monthlyLimit)}
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-danger/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-text-secondary hover:text-danger" />
        </button>
      </div>

      <div className="space-y-1">
        <Progress value={cappedPercentage} className={cn("h-2 bg-bg-input", getProgressColor())} />
        <div className="flex justify-between items-center">
          <span className={cn("text-xs font-medium", getStatusColor())}>
            {percentage.toFixed(0)}%
          </span>
          <span className="text-xs text-text-secondary">
            เหลือ {formatCurrency(Math.max(monthlyLimit - spent, 0))}
          </span>
        </div>
      </div>

      {percentage >= 80 && percentage < 100 && (
        <div className="flex items-center gap-2 bg-warning/10 rounded-lg px-3 py-2">
          <span className="text-warning text-xs">ใกล้ถึงงบประมาณแล้ว</span>
        </div>
      )}
      {percentage >= 100 && (
        <div className="flex items-center gap-2 bg-danger/10 rounded-lg px-3 py-2">
          <span className="text-danger text-xs">เกินงบประมาณแล้ว!</span>
        </div>
      )}
    </div>
  );
}
