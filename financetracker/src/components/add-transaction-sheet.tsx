"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[90dvh] overflow-y-auto"
        style={{ background: "#131320", border: "none", borderTop: "1px solid #2a2a4a", padding: "24px 20px" }}
      >
        <SheetHeader style={{ paddingBottom: "16px" }}>
          <SheetTitle style={{ color: "#f1f5f9", fontSize: "18px" }}>เพิ่มรายการ</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "24px" }}>
          {/* Type Toggle */}
          <div className="flex gap-1 rounded-xl" style={{ padding: "4px", background: "#1a1a2e" }}>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className="flex-1 rounded-lg text-sm font-medium transition-all"
              style={{
                padding: "12px 0",
                background: selectedType === "expense" ? "#ef4444" : "transparent",
                color: selectedType === "expense" ? "#fff" : "#94a3b8",
              }}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className="flex-1 rounded-lg text-sm font-medium transition-all"
              style={{
                padding: "12px 0",
                background: selectedType === "income" ? "#22c55e" : "transparent",
                color: selectedType === "income" ? "#fff" : "#94a3b8",
              }}
            >
              รายรับ
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm" style={{ color: "#94a3b8", marginBottom: "8px" }}>จำนวนเงิน</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold" style={{ color: "#a855f7" }}>฿</span>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-xl text-2xl font-bold text-right outline-none"
                    style={{ height: "56px", paddingLeft: "48px", paddingRight: "16px", background: "#1a1a2e", border: "1px solid #2a2a4a", color: "#f1f5f9" }}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    onFocus={(e) => { e.target.style.borderColor = "#a855f7"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#2a2a4a"; }}
                  />
                )}
              />
            </div>
            {errors.amount && <p className="text-xs" style={{ color: "#ef4444", marginTop: "4px" }}>{errors.amount.message}</p>}
          </div>

          {/* Category Grid */}
          <div>
            <label className="block text-sm" style={{ color: "#94a3b8", marginBottom: "10px" }}>หมวดหมู่</label>
            <div className="grid grid-cols-4" style={{ gap: "10px" }}>
              {categories.map((cat: Category) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setValue("category", cat.value)}
                    className="flex flex-col items-center rounded-xl transition-all"
                    style={{
                      padding: "12px 4px",
                      gap: "8px",
                      background: isSelected ? "rgba(168, 85, 247, 0.15)" : "#1a1a2e",
                      border: isSelected ? "2px solid #a855f7" : "2px solid transparent",
                      boxShadow: isSelected ? "0 0 15px rgba(168, 85, 247, 0.2)" : "none",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="text-xs" style={{ color: "#ef4444", marginTop: "4px" }}>{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm" style={{ color: "#94a3b8", marginBottom: "8px" }}>วันที่</label>
            <input
              type="date"
              className="w-full rounded-xl outline-none"
              style={{ height: "44px", padding: "0 16px", background: "#1a1a2e", border: "1px solid #2a2a4a", color: "#f1f5f9" }}
              {...register("date")}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm" style={{ color: "#94a3b8", marginBottom: "8px" }}>บันทึก (ไม่บังคับ)</label>
            <input
              placeholder="เช่น ข้าวมันไก่, ค่าแท็กซี่..."
              className="w-full rounded-xl outline-none text-sm"
              style={{ height: "44px", padding: "0 16px", background: "#1a1a2e", border: "1px solid #2a2a4a", color: "#f1f5f9" }}
              {...register("note")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{
              height: "50px",
              fontSize: "16px",
              background: "linear-gradient(135deg, #a855f7, #9333ea)",
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
            }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                กำลังบันทึก...
              </span>
            ) : (
              "บันทึกรายการ"
            )}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
