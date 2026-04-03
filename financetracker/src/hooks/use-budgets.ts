"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import type { Database } from "@/types/database";

type Budget = Database["public"]["Tables"]["budgets"]["Row"];

interface BudgetWithSpent extends Budget {
  spent: number;
  percentage: number;
}

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      // Get budgets
      const { data: budgetData, error: budgetError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .order("category");

      if (budgetError) throw budgetError;

      // Get current month expense transactions
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

      const { data: txData } = await supabase
        .from("transactions")
        .select("category, amount")
        .eq("user_id", user.id)
        .eq("type", "expense")
        .gte("date", monthStart)
        .lte("date", monthEnd);

      // Calculate spent per category
      const spentMap = new Map<string, number>();
      for (const tx of txData || []) {
        spentMap.set(tx.category, (spentMap.get(tx.category) || 0) + Number(tx.amount));
      }

      const budgetsWithSpent: BudgetWithSpent[] = (budgetData || []).map((b) => {
        const spent = spentMap.get(b.category) || 0;
        const percentage = b.monthly_limit > 0 ? (spent / Number(b.monthly_limit)) * 100 : 0;
        return { ...b, spent, percentage };
      });

      setBudgets(budgetsWithSpent);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = async (category: string, monthlyLimit: number) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("budgets")
      .upsert(
        { user_id: user.id, category, monthly_limit: monthlyLimit },
        { onConflict: "user_id,category" }
      );

    if (!error) await fetchBudgets();
    return { error: error?.message || null };
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (!error) setBudgets((prev) => prev.filter((b) => b.id !== id));
    return { error: error?.message || null };
  };

  return { budgets, loading, error, refetch: fetchBudgets, addBudget, deleteBudget };
}
