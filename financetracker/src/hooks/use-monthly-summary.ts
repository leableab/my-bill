"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { getCategoryByValue } from "@/lib/constants";
import { MONTHS_TH_SHORT } from "@/lib/constants";

interface MonthData {
  month: string;
  income: number;
  expense: number;
}

interface CategoryData {
  category: string;
  label: string;
  amount: number;
  color: string;
  percentage: number;
}

interface ReportData {
  currentIncome: number;
  currentExpense: number;
  currentNet: number;
  monthlyData: MonthData[];
  categoryData: CategoryData[];
}

export function useMonthlyReport(month: number, year: number) {
  const { user } = useAuth();
  const [data, setData] = useState<ReportData>({
    currentIncome: 0,
    currentExpense: 0,
    currentNet: 0,
    monthlyData: [],
    categoryData: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Current month transactions
      const monthStart = new Date(year, month, 1).toISOString().split("T")[0];
      const monthEnd = new Date(year, month + 1, 0).toISOString().split("T")[0];

      const { data: currentTx } = await supabase
        .from("transactions")
        .select("type, amount, category")
        .eq("user_id", user.id)
        .gte("date", monthStart)
        .lte("date", monthEnd);

      let currentIncome = 0,
        currentExpense = 0;
      const catMap = new Map<string, number>();

      for (const tx of currentTx || []) {
        const amt = Number(tx.amount);
        if (tx.type === "income") currentIncome += amt;
        else {
          currentExpense += amt;
          catMap.set(tx.category, (catMap.get(tx.category) || 0) + amt);
        }
      }

      const categoryData: CategoryData[] = Array.from(catMap.entries())
        .map(([cat, amount]) => {
          const info = getCategoryByValue(cat);
          return {
            category: cat,
            label: info?.label || cat,
            amount,
            color: info?.color || "#64748b",
            percentage:
              currentExpense > 0 ? (amount / currentExpense) * 100 : 0,
          };
        })
        .sort((a, b) => b.amount - a.amount);

      // Last 6 months data for bar chart
      const monthlyData: MonthData[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(year, month - i, 1);
        const mStart = d.toISOString().split("T")[0];
        const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        const { data: mTx } = await supabase
          .from("transactions")
          .select("type, amount")
          .eq("user_id", user.id)
          .gte("date", mStart)
          .lte("date", mEnd);

        let inc = 0,
          exp = 0;
        for (const tx of mTx || []) {
          if (tx.type === "income") inc += Number(tx.amount);
          else exp += Number(tx.amount);
        }

        monthlyData.push({
          month: MONTHS_TH_SHORT[d.getMonth()],
          income: inc,
          expense: exp,
        });
      }

      setData({
        currentIncome,
        currentExpense,
        currentNet: currentIncome - currentExpense,
        monthlyData,
        categoryData,
      });
    } catch (err) {
      console.error("Report fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, month, year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { ...data, loading, refetch: fetchReport };
}
