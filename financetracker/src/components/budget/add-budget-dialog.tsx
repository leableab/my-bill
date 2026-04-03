"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { budgetSchema, type BudgetFormData } from "@/lib/schemas";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
      <DialogContent className="bg-bg-card border-border max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="text-text-primary">ตั้งงบประมาณ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">หมวดหมู่</Label>
            <div className="grid grid-cols-4 gap-2">
              {availableCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setValue("category", cat.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                      isSelected
                        ? "bg-accent/20 border-2 border-accent"
                        : "bg-bg-input border-2 border-transparent hover:border-border"
                    )}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    <span className="text-[9px] text-text-secondary">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="text-danger text-xs">{errors.category.message}</p>}
            {availableCategories.length === 0 && (
              <p className="text-text-secondary text-xs text-center py-2">ตั้งงบประมาณครบทุกหมวดหมู่แล้ว</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">งบประมาณรายเดือน (฿)</Label>
            <Controller
              name="monthly_limit"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-bg-input border-border text-text-primary text-right text-lg font-semibold"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              )}
            />
            {errors.monthly_limit && <p className="text-danger text-xs">{errors.monthly_limit.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={saving || availableCategories.length === 0}
            className="w-full bg-accent hover:bg-accent-dark text-white font-medium"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            บันทึก
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
