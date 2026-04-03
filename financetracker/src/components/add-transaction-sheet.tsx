"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { transactionSchema, type TransactionFormData } from "@/lib/schemas";
import { getCategoriesByType, type Category } from "@/lib/constants";
import { useTransactions } from "@/hooks/use-transactions";
import { toISODateString } from "@/lib/format";

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddTransactionSheet({ open, onOpenChange, onSuccess }: AddTransactionSheetProps) {
  const { addTransaction } = useTransactions();
  const [saving, setSaving] = useState(false);

  const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: undefined,
      category: "",
      note: "",
      date: toISODateString(new Date()),
    },
  });

  const selectedType = watch("type");
  const selectedCategory = watch("category");
  const categories = getCategoriesByType(selectedType);

  const onSubmit = async (data: TransactionFormData) => {
    setSaving(true);
    const { error } = await addTransaction({
      type: data.type,
      amount: data.amount,
      category: data.category,
      note: data.note || null,
      date: data.date,
    });

    if (error) {
      toast.error("เกิดข้อผิดพลาด", { description: error });
    } else {
      toast.success("บันทึกสำเร็จ", {
        description: data.type === "income" ? "เพิ่มรายรับเรียบร้อย" : "เพิ่มรายจ่ายเรียบร้อย",
      });
      reset();
      onOpenChange(false);
      onSuccess?.();
    }
    setSaving(false);
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setValue("type", type);
    setValue("category", "");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-bg-card border-border rounded-t-3xl max-h-[85dvh] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-text-primary text-lg">เพิ่มรายการ</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-6">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-bg-input rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                selectedType === "expense"
                  ? "bg-danger text-white shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                selectedType === "income"
                  ? "bg-success text-white shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              รายรับ
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">จำนวนเงิน</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-accent font-bold">฿</span>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-12 h-14 text-2xl font-bold bg-bg-input border-border text-text-primary text-right focus:border-accent"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                )}
              />
            </div>
            {errors.amount && <p className="text-danger text-xs">{errors.amount.message}</p>}
          </div>

          {/* Category Grid */}
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">หมวดหมู่</Label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat: Category) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setValue("category", cat.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all",
                      isSelected
                        ? "bg-accent/20 border-2 border-accent glow-purple-sm"
                        : "bg-bg-input border-2 border-transparent hover:border-border"
                    )}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <span className="text-[10px] text-text-secondary font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="text-danger text-xs">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">วันที่</Label>
            <Input
              type="date"
              className="bg-bg-input border-border text-text-primary focus:border-accent"
              {...register("date")}
            />
            {errors.date && <p className="text-danger text-xs">{errors.date.message}</p>}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">บันทึก (ไม่บังคับ)</Label>
            <Input
              placeholder="เช่น ข้าวมันไก่, ค่าแท็กซี่..."
              className="bg-bg-input border-border text-text-primary placeholder:text-text-secondary/50 focus:border-accent"
              {...register("note")}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full h-12 bg-accent hover:bg-accent-dark text-white font-semibold text-base glow-purple-sm hover:glow-purple transition-all"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            บันทึกรายการ
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
