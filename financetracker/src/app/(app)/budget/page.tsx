"use client";

import { useState, useEffect } from "react";
import { useBudgets } from "@/hooks/use-budgets";
import { BudgetCard } from "@/components/budget/budget-card";
import { AddBudgetDialog } from "@/components/budget/add-budget-dialog";
import { Plus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

export default function BudgetPage() {
  const { budgets, loading, addBudget, deleteBudget, refetch } = useBudgets();
  const [showDialog, setShowDialog] = useState(false);

  // Check for budget alerts on load
  useEffect(() => {
    for (const b of budgets) {
      if (b.percentage >= 100) {
        toast.error(`${b.category} เกินงบประมาณแล้ว!`, {
          description: `ใช้ไป ${formatCurrency(b.spent)} จากงบ ${formatCurrency(Number(b.monthly_limit))}`,
        });
      } else if (b.percentage >= 80) {
        toast.warning(`${b.category} ใกล้ถึงงบประมาณ`, {
          description: `ใช้ไปแล้ว ${b.percentage.toFixed(0)}%`,
        });
      }
    }
  }, [budgets]);

  const handleSave = async (category: string, amount: number) => {
    const result = await addBudget(category, amount);
    if (result.error) {
      toast.error("เกิดข้อผิดพลาด", { description: result.error });
    } else {
      toast.success("ตั้งงบประมาณเรียบร้อย");
    }
    return result;
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteBudget(id);
    if (error) toast.error("ลบไม่สำเร็จ");
    else toast.success("ลบงบประมาณเรียบร้อย");
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.monthly_limit), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: "bold" }}>งบประมาณ</h1>
        <button
          onClick={() => setShowDialog(true)}
          style={{
            background: "#a855f7",
            color: "white",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          เพิ่ม
        </button>
      </div>

      {/* Total overview */}
      {!loading && budgets.length > 0 && (
        <div
          style={{
            background: "#131320",
            border: "1px solid #2a2a4a",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <Wallet style={{ width: 20, height: 20, color: "#a855f7" }} />
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>ภาพรวมเดือนนี้</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <span style={{ color: "#94a3b8" }}>ใช้ไปแล้ว</span>
            <span style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </span>
          </div>
        </div>
      )}

      {/* Budget List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "120px",
                background: "#1a1a2e",
                borderRadius: "16px",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div
          style={{
            background: "#131320",
            border: "1px solid #2a2a4a",
            borderRadius: "16px",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Wallet style={{ width: 48, height: 48, color: "#94a3b8", opacity: 0.5, marginBottom: "12px" }} />
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>ยังไม่ได้ตั้งงบประมาณ</p>
          <button
            onClick={() => setShowDialog(true)}
            style={{
              background: "linear-gradient(135deg, #a855f7, #9333ea)",
              color: "white",
              height: "50px",
              padding: "0 24px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "14px",
              boxShadow: "0 0 15px rgba(168,85,247,0.3)",
            }}
          >
            ตั้งงบประมาณแรก
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              category={b.category}
              monthlyLimit={Number(b.monthly_limit)}
              spent={b.spent}
              percentage={b.percentage}
              onDelete={() => handleDelete(b.id)}
            />
          ))}
        </div>
      )}

      <AddBudgetDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSave}
        existingCategories={budgets.map((b) => b.category)}
      />
    </div>
  );
}
