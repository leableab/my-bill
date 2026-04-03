"use client";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  loading: boolean;
}

export function BalanceCard({ balance, loading }: BalanceCardProps) {
  return (
    <div className="relative rounded-2xl bg-bg-card border border-border p-6 text-center glow-purple overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-dark/10" />
      <div className="relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-accent" />
          <span className="text-text-secondary text-sm">ยอดเงินคงเหลือ</span>
        </div>
        {loading ? (
          <Skeleton className="h-10 w-48 mx-auto" />
        ) : (
          <p
            className={`text-3xl font-bold glow-text-lg ${balance >= 0 ? "text-text-primary" : "text-danger"}`}
          >
            {formatCurrency(balance)}
          </p>
        )}
      </div>
    </div>
  );
}
