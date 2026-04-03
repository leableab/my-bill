"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { profileSchema, type ProfileFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User, LogOut, Bell, Coins, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState(80);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as never,
  });

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        reset({
          display_name: data.display_name || "",
          currency: data.currency || "฿",
          budget_alert_threshold: data.budget_alert_threshold || 80,
        });
        setThreshold(data.budget_alert_threshold || 80);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: data.display_name,
        currency: data.currency,
        budget_alert_threshold: threshold,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("บันทึกไม่สำเร็จ", { description: error.message });
    } else {
      toast.success("บันทึกการตั้งค่าเรียบร้อย");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-text-primary">ตั้งค่า</h1>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-text-primary">ตั้งค่า</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Profile Section */}
        <div className="rounded-xl bg-bg-card border border-border p-4 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">โปรไฟล์</p>
              <p className="text-xs text-text-secondary">{user?.email}</p>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">ชื่อที่แสดง</Label>
            <Input
              placeholder="ชื่อของคุณ"
              className="bg-bg-input border-border text-text-primary"
              {...register("display_name")}
            />
            {errors.display_name && <p className="text-danger text-xs">{errors.display_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">สกุลเงิน</Label>
            <div className="flex items-center gap-3 p-3 bg-bg-input rounded-lg border border-border">
              <Coins className="w-4 h-4 text-accent" />
              <span className="text-text-primary text-sm">บาท (฿)</span>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        <div className="rounded-xl bg-bg-card border border-border p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-text-primary">การแจ้งเตือนงบประมาณ</span>
          </div>
          <Separator className="bg-border" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">แจ้งเตือนเมื่อใช้เกิน</span>
              <span className="text-accent font-semibold">{threshold}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2 bg-bg-input rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xs text-text-secondary">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:bg-accent-dark text-white font-medium"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          บันทึกการตั้งค่า
        </Button>
      </form>

      {/* App Info */}
      <div className="rounded-xl bg-bg-card border border-border p-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-text-secondary" />
          <div>
            <p className="text-sm text-text-primary">My Bill</p>
            <p className="text-xs text-text-secondary">เวอร์ชัน 1.0.0 — จัดการค่าใช้จ่ายอย่างชาญฉลาด</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full border-danger/30 text-danger hover:bg-danger/10 hover:text-danger"
      >
        <LogOut className="w-4 h-4 mr-2" />
        ออกจากระบบ
      </Button>
    </div>
  );
}
