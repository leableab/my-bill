"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import type { Database } from "@/types/database";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];

interface UseTransactionsOptions {
  month?: number; // 0-11
  year?: number;
  type?: "income" | "expense";
  category?: string;
  search?: string;
  limit?: number;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      // Apply month/year filter
      if (options.year !== undefined && options.month !== undefined) {
        const startDate = new Date(options.year, options.month, 1);
        const endDate = new Date(options.year, options.month + 1, 0);
        query = query.gte("date", startDate.toISOString().split("T")[0]);
        query = query.lte("date", endDate.toISOString().split("T")[0]);
      }

      if (options.type) {
        query = query.eq("type", options.type);
      }

      if (options.category) {
        query = query.eq("category", options.category);
      }

      if (options.search) {
        query = query.ilike("note", `%${options.search}%`);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user, options.month, options.year, options.type, options.category, options.search, options.limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (data: Omit<TransactionInsert, "user_id">) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("transactions")
      .insert({ ...data, user_id: user.id });

    if (!error) {
      await fetchTransactions();
    }
    return { error: error?.message || null };
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
    return { error: error?.message || null };
  };

  return { transactions, loading, error, refetch: fetchTransactions, addTransaction, deleteTransaction };
}
