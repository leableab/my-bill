"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { getCategoryByValue } from "@/lib/constants";
import { toast } from "sonner";

interface CsvExportProps {
  month: number;
  year: number;
}

export function CsvExport({ month, year }: CsvExportProps) {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);

    try {
      const monthStart = new Date(year, month, 1).toISOString().split("T")[0];
      const monthEnd = new Date(year, month + 1, 0).toISOString().split("T")[0];

      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", monthStart)
        .lte("date", monthEnd)
        .order("date", { ascending: true });

      if (error) throw error;
      if (!transactions?.length) {
        toast.error("ไม่มีข้อมูลในเดือนนี้");
        return;
      }

      // Build CSV
      const headers = "วันที่,ประเภท,หมวดหมู่,จำนวนเงิน,บันทึก";
      const rows = transactions.map((tx) => {
        const cat = getCategoryByValue(tx.category);
        return [
          tx.date,
          tx.type === "income" ? "รายรับ" : "รายจ่าย",
          cat?.label || tx.category,
          tx.amount,
          `"${(tx.note || "").replace(/"/g, '""')}"`,
        ].join(",");
      });

      const csv = "\uFEFF" + [headers, ...rows].join("\n"); // BOM for Thai encoding
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mybill-${year}-${String(month + 1).padStart(2, "0")}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("ส่งออกข้อมูลเรียบร้อย");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด", {
        description: (err as Error).message,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      style={{
        width: "100%",
        height: "44px",
        background: "transparent",
        border: "1px solid #2a2a4a",
        borderRadius: "12px",
        color: "#f1f5f9",
        cursor: exporting ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontSize: "14px",
        opacity: exporting ? 0.6 : 1,
      }}
    >
      {exporting ? (
        <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
      ) : (
        <Download style={{ width: 16, height: 16 }} />
      )}
      ส่งออก CSV
    </button>
  );
}
