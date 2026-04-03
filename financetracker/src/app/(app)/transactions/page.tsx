"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { FilterBar } from "@/components/transactions/filter-bar";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

export default function TransactionsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");

  const { transactions, loading, deleteTransaction } = useTransactions({
    month,
    year,
    type: typeFilter === "all" ? undefined : typeFilter,
    search: search || undefined,
  });

  const { totalIncome, totalExpense } = useMemo(() => {
    let inc = 0, exp = 0;
    for (const tx of transactions) {
      if (tx.type === "income") inc += Number(tx.amount);
      else exp += Number(tx.amount);
    }
    return { totalIncome: inc, totalExpense: exp };
  }, [transactions]);

  const handleDelete = async (id: string) => {
    const { error } = await deleteTransaction(id);
    if (error) toast.error("ลบไม่สำเร็จ", { description: error });
    else toast.success("ลบรายการเรียบร้อย");
  };

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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>
        รายการทั้งหมด
      </h1>

      <FilterBar
        month={month}
        year={year}
        type={typeFilter}
        search={search}
        onMonthChange={(m, y) => { setMonth(m); setYear(y); }}
        onTypeChange={setTypeFilter}
        onSearchChange={setSearch}
      />

      {/* Summary */}
      <div
        className="flex justify-between rounded-xl"
        style={{ padding: "12px 16px", background: "#131320", border: "1px solid #1e1e3a" }}
      >
        <span className="text-xs font-medium" style={{ color: "#22c55e" }}>
          รับ {formatCurrency(totalIncome)}
        </span>
        <span className="text-xs font-medium" style={{ color: "#ef4444" }}>
          จ่าย {formatCurrency(totalExpense)}
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: totalIncome - totalExpense >= 0 ? "#a855f7" : "#ef4444" }}
        >
          คงเหลือ {formatCurrency(totalIncome - totalExpense)}
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl animate-pulse" style={{ height: "68px", background: "#131320" }} />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="text-center" style={{ padding: "48px 0" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>ไม่มีรายการในเดือนนี้</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {grouped.map(([date, txs]) => (
            <div key={date} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p className="font-medium" style={{ color: "#64748b", fontSize: "12px", paddingLeft: "4px" }}>
                {new Date(date).toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" })}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {txs.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
