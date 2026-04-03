"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";

interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  categoryBreakdown: { category: string; amount: number; color: string }[];
}

export function useDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

      // Get ALL transactions for total balance
      const { data: allTx } = await supabase
        .from("transactions")
        .select("type, amount")
        .eq("user_id", user.id);

      // Get current month transactions
      const { data: monthTx } = await supabase
        .from("transactions")
        .select("type, amount, category")
        .eq("user_id", user.id)
        .gte("date", monthStart)
        .lte("date", monthEnd);

      let totalBalance = 0;
      for (const tx of allTx || []) {
        totalBalance += tx.type === "income" ? Number(tx.amount) : -Number(tx.amount);
      }

      let monthlyIncome = 0;
      let monthlyExpense = 0;
      const categoryMap = new Map<string, number>();

      for (const tx of monthTx || []) {
        const amount = Number(tx.amount);
        if (tx.type === "income") {
          monthlyIncome += amount;
        } else {
          monthlyExpense += amount;
          categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + amount);
        }
      }

      // Import getCategoryByValue at runtime to get colors
      const { getCategoryByValue } = await import("@/lib/constants");
      const categoryBreakdown = Array.from(categoryMap.entries())
        .map(([category, amount]) => ({
          category,
          amount,
          color: getCategoryByValue(category)?.color || "#64748b",
        }))
        .sort((a, b) => b.amount - a.amount);

      setData({ totalBalance, monthlyIncome, monthlyExpense, categoryBreakdown });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { ...data, loading, refetch: fetchDashboard };
}
