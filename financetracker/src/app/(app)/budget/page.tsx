"use client";

import { useState, useEffect } from "react";
import { useBudgets } from "@/hooks/use-budgets";
import { BudgetCard } from "@/components/budget/budget-card";
import { AddBudgetDialog } from "@/components/budget/add-budget-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">งบประมาณ</h1>
        <Button
          onClick={() => setShowDialog(true)}
          size="sm"
          className="bg-accent hover:bg-accent-dark text-white gap-1"
        >
          <Plus className="w-4 h-4" />
          เพิ่ม
        </Button>
      </div>

      {/* Total overview */}
      {!loading && budgets.length > 0 && (
        <div className="rounded-xl bg-bg-card border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-5 h-5 text-accent" />
            <span className="text-sm text-text-secondary">ภาพรวมเดือนนี้</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">ใช้ไปแล้ว</span>
            <span className="text-text-primary font-semibold">
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </span>
          </div>
        </div>
      )}

      {/* Budget List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16">
          <Wallet className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
          <p className="text-text-secondary mb-4">ยังไม่ได้ตั้งงบประมาณ</p>
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-accent hover:bg-accent-dark text-white"
          >
            ตั้งงบประมาณแรก
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
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
