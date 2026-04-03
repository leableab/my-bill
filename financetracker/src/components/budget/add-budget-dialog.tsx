"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { budgetSchema, type BudgetFormData } from "@/lib/schemas";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: string, amount: number) => Promise<{ error: string | null }>;
  existingCategories: string[];
}

export function AddBudgetDialog({ open, onOpenChange, onSave, existingCategories }: AddBudgetDialogProps) {
  const [saving, setSaving] = useState(false);
  const { control, register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { category: "", monthly_limit: undefined },
  });

  const selectedCategory = watch("category");
  const availableCategories = EXPENSE_CATEGORIES.filter((c) => !existingCategories.includes(c.value));

  const onSubmit = async (data: BudgetFormData) => {
    setSaving(true);
    const { error } = await onSave(data.category, data.monthly_limit);
    if (!error) {
      reset();
      onOpenChange(false);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          background: "#131320",
          border: "1px solid #2a2a4a",
          borderRadius: "16px",
          maxWidth: "380px",
          padding: "20px",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#f1f5f9", fontSize: "16px", fontWeight: "bold" }}>
            ตั้งงบประมาณ
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Category Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "2px" }}>หมวดหมู่</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}
            >
              {availableCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setValue("category", cat.value)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "12px",
                      borderRadius: "12px",
                      background: isSelected ? "rgba(168,85,247,0.2)" : "#1a1a2e",
                      border: isSelected ? "2px solid #a855f7" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon style={{ width: 20, height: 20, color: cat.color }} />
                    <span style={{ fontSize: "9px", color: "#94a3b8" }}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && <p style={{ color: "#ef4444", fontSize: "12px" }}>{errors.category.message}</p>}
            {availableCategories.length === 0 && (
              <p style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center", padding: "8px 0" }}>
                ตั้งงบประมาณครบทุกหมวดหมู่แล้ว
              </p>
            )}
          </div>

          {/* Amount */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "2px" }}>
              งบประมาณรายเดือน (฿)
            </label>
            <Controller
              name="monthly_limit"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  style={{
                    height: "50px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    background: "#1a1a2e",
                    border: "1px solid #2a2a4a",
                    color: "#f1f5f9",
                    fontSize: "18px",
                    fontWeight: 600,
                    textAlign: "right",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#a855f7";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(168,85,247,0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a4a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              )}
            />
            {errors.monthly_limit && <p style={{ color: "#ef4444", fontSize: "12px" }}>{errors.monthly_limit.message}</p>}
          </div>

          <button
            type="submit"
            disabled={saving || availableCategories.length === 0}
            style={{
              width: "100%",
              height: "50px",
              background: saving || availableCategories.length === 0
                ? "#64748b"
                : "linear-gradient(135deg, #a855f7, #9333ea)",
              color: "white",
              borderRadius: "12px",
              border: "none",
              cursor: saving || availableCategories.length === 0 ? "not-allowed" : "pointer",
              fontWeight: 500,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: saving || availableCategories.length === 0
                ? "none"
                : "0 0 15px rgba(168,85,247,0.3)",
            }}
          >
            {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : null}
            บันทึก
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
