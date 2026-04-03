"use client";

import { useState, useRef } from "react";
import { getCategoryByValue } from "@/lib/constants";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type { Database } from "@/types/database";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const cat = getCategoryByValue(transaction.category);
  const Icon = cat?.icon;
  const isIncome = transaction.type === "income";

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientX - startX.current;
    // Only allow swipe left (negative)
    if (diff < 0) {
      setTranslateX(Math.max(diff, -100));
    } else {
      setTranslateX(0);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (translateX < -60) {
      setTranslateX(-80); // snap to show delete
    } else {
      setTranslateX(0); // snap back
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete background */}
      <div className="absolute inset-y-0 right-0 w-20 bg-danger flex items-center justify-center rounded-r-xl">
        <button onClick={() => onDelete(transaction.id)} className="p-2">
          <Trash2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main content - swipeable */}
      <div
        className="relative bg-bg-card border border-border rounded-xl p-3 flex items-center gap-3 transition-transform"
        style={{
          transform: `translateX(${translateX}px)`,
          transitionDuration: isDragging.current ? "0ms" : "200ms",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${cat?.color || "#64748b"}20` }}
        >
          {Icon && <Icon className="w-5 h-5" style={{ color: cat?.color }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {cat?.label || transaction.category}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {transaction.note || formatDateShort(transaction.date)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn("text-sm font-semibold", isIncome ? "text-success" : "text-danger")}>
            {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
          <p className="text-[10px] text-text-secondary">{formatDateShort(transaction.date)}</p>
        </div>
      </div>
    </div>
  );
}
