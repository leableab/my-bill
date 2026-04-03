"use client";

import { useState, useRef } from "react";
import { getCategoryByValue } from "@/lib/constants";
import { formatCurrency, formatDateShort } from "@/lib/format";
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
    if (diff < 0) {
      setTranslateX(Math.max(diff, -100));
    } else {
      setTranslateX(0);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (translateX < -60) {
      setTranslateX(-80);
    } else {
      setTranslateX(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete background */}
      <div
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center rounded-r-xl"
        style={{ background: "#ef4444" }}
      >
        <button onClick={() => onDelete(transaction.id)} className="p-2">
          <Trash2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main content */}
      <div
        className="relative rounded-xl flex items-center gap-3 transition-transform"
        style={{
          padding: "14px 16px",
          background: "#131320",
          border: "1px solid #1e1e3a",
          transform: `translateX(${translateX}px)`,
          transitionDuration: isDragging.current ? "0ms" : "200ms",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${cat?.color || "#64748b"}20` }}
        >
          {Icon && <Icon className="w-5 h-5" style={{ color: cat?.color }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "#f1f5f9" }}>
            {cat?.label || transaction.category}
          </p>
          <p className="text-xs truncate" style={{ color: "#64748b", marginTop: "2px" }}>
            {transaction.note || formatDateShort(transaction.date)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className="text-sm font-semibold"
            style={{ color: isIncome ? "#22c55e" : "#ef4444" }}
          >
            {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
          <p style={{ color: "#64748b", fontSize: "10px", marginTop: "2px" }}>
            {formatDateShort(transaction.date)}
          </p>
        </div>
      </div>
    </div>
  );
}
