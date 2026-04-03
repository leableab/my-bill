"use client";

import { formatCurrency } from "@/lib/format";
import { Wallet } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  loading: boolean;
}

export function BalanceCard({ balance, loading }: BalanceCardProps) {
  return (
    <div
      className="relative rounded-2xl p-6 text-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #131320 0%, #1a1035 50%, #131320 100%)",
        border: "1px solid #2a2a4a",
        boxShadow: "0 0 30px rgba(168, 85, 247, 0.2), 0 0 60px rgba(168, 85, 247, 0.08)",
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Wallet className="w-5 h-5" style={{ color: "#a855f7" }} />
          <span style={{ color: "#94a3b8", fontSize: "14px" }}>ยอดเงินคงเหลือ</span>
        </div>
        {loading ? (
          <div className="h-10 w-48 mx-auto rounded-lg animate-pulse" style={{ background: "#1a1a2e" }} />
        ) : (
          <p
            className="text-4xl font-bold"
            style={{
              color: balance >= 0 ? "#f1f5f9" : "#ef4444",
              textShadow: "0 0 20px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.2)",
            }}
          >
            {formatCurrency(balance)}
          </p>
        )}
      </div>
    </div>
  );
}
