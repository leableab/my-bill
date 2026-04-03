"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/providers/auth-provider";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { formatMonthYear } from "@/lib/format";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    categoryBreakdown,
    loading: dashLoading,
    refetch,
  } = useDashboard();
  const { transactions: recentTx, loading: txLoading } = useTransactions({
    limit: 5,
  });

  const now = new Date();
  const greeting = getGreeting();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">{greeting}</p>
          <h1 className="text-lg font-bold text-text-primary">
            {user?.user_metadata?.display_name ||
              user?.email?.split("@")[0] ||
              "ผู้ใช้"}
          </h1>
        </div>
        <Link
          href="/settings"
          className="w-10 h-10 rounded-full bg-bg-card border border-border flex items-center justify-center hover:border-accent transition-colors"
        >
          <Settings className="w-5 h-5 text-text-secondary" />
        </Link>
      </div>

      {/* Month indicator */}
      <p className="text-text-secondary text-xs">{formatMonthYear(now)}</p>

      {/* Balance */}
      <BalanceCard balance={totalBalance} loading={dashLoading} />

      {/* Income/Expense Summary */}
      <SummaryCards
        income={monthlyIncome}
        expense={monthlyExpense}
        loading={dashLoading}
      />

      {/* Donut Chart */}
      <DonutChart data={categoryBreakdown} loading={dashLoading} />

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTx} loading={txLoading} />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "สวัสดีตอนเช้า 🌅";
  if (hour < 17) return "สวัสดีตอนบ่าย ☀️";
  return "สวัสดีตอนเย็น 🌙";
}
