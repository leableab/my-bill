"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { FilterBar } from "@/components/transactions/filter-bar";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

export default function TransactionsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [search, setSearch] = useState("");

  const { transactions, loading, deleteTransaction } = useTransactions({
    month,
    year,
    type: typeFilter === "all" ? undefined : typeFilter,
    search: search || undefined,
  });

  const { totalIncome, totalExpense } = useMemo(() => {
    let inc = 0,
      exp = 0;
    for (const tx of transactions) {
      if (tx.type === "income") inc += Number(tx.amount);
      else exp += Number(tx.amount);
    }
    return { totalIncome: inc, totalExpense: exp };
  }, [transactions]);

  const handleDelete = async (id: string) => {
    const { error } = await deleteTransaction(id);
    if (error) {
      toast.error("ลบไม่สำเร็จ", { description: error });
    } else {
      toast.success("ลบรายการเรียบร้อย");
    }
  };

  // Group transactions by date
  const grouped = useMemo(() => {
    const groups = new Map<string, typeof transactions>();
    for (const tx of transactions) {
      const key = tx.date;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(tx);
    }
    return Array.from(groups.entries());
  }, [transactions]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-text-primary">รายการทั้งหมด</h1>

      <FilterBar
        month={month}
        year={year}
        type={typeFilter}
        search={search}
        onMonthChange={(m, y) => {
          setMonth(m);
          setYear(y);
        }}
        onTypeChange={setTypeFilter}
        onSearchChange={setSearch}
      />

      {/* Monthly summary mini bar */}
      <div className="flex justify-between text-xs px-1">
        <span className="text-success">รับ {formatCurrency(totalIncome)}</span>
        <span className="text-danger">จ่าย {formatCurrency(totalExpense)}</span>
        <span
          className={
            totalIncome - totalExpense >= 0 ? "text-accent" : "text-danger"
          }
        >
          คงเหลือ {formatCurrency(totalIncome - totalExpense)}
        </span>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">ไม่มีรายการในเดือนนี้</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, txs]) => (
            <div key={date} className="space-y-2">
              <p className="text-xs text-text-secondary px-1 font-medium">
                {new Date(date).toLocaleDateString("th-TH", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <div className="space-y-2">
                {txs.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
