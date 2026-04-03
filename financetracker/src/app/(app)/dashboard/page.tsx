"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/providers/auth-provider";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { formatMonthYear } from "@/lib/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    categoryBreakdown,
    loading: dashLoading,
  } = useDashboard();
  const { transactions: recentTx, loading: txLoading } = useTransactions({
    limit: 5,
  });

  const now = new Date();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p style={{ color: "#94a3b8", fontSize: "13px" }}>{getGreeting()}</p>
        <h1 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>
          {user?.user_metadata?.display_name ||
            user?.email?.split("@")[0] ||
            "ผู้ใช้"}
        </h1>
      </div>

      {/* Month */}
      <p style={{ color: "#64748b", fontSize: "12px" }}>{formatMonthYear(now)}</p>

      <BalanceCard balance={totalBalance} loading={dashLoading} />
      <SummaryCards income={monthlyIncome} expense={monthlyExpense} loading={dashLoading} />
      <DonutChart data={categoryBreakdown} loading={dashLoading} />
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
