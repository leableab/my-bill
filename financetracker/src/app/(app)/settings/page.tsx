"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { profileSchema, type ProfileFormData } from "@/lib/schemas";
import { User, LogOut, Bell, Coins, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

const cardStyle: React.CSSProperties = {
  background: "#131320",
  border: "1px solid #2a2a4a",
  borderRadius: "16px",
  padding: "20px",
};

const labelStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "14px",
  marginBottom: "10px",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "50px",
  padding: "0 16px",
  borderRadius: "12px",
  background: "#1a1a2e",
  border: "1px solid #2a2a4a",
  color: "#f1f5f9",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const separatorStyle: React.CSSProperties = {
  height: "1px",
  background: "#1e1e3a",
  border: "none",
  margin: "16px 0",
};

const iconBoxStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  minWidth: "40px",
  background: "rgba(168,85,247,0.15)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState(80);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    ...inputStyle,
    ...(focusedField === fieldName
      ? { borderColor: "#a855f7", boxShadow: "0 0 15px rgba(168,85,247,0.2)" }
      : {}),
  });

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: "bold", margin: 0 }}>ตั้งค่า</h1>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "64px",
              borderRadius: "12px",
              background: "#1a1a2e",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1 style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: "bold", margin: 0 }}>ตั้งค่า</h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Profile Section */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={iconBoxStyle}>
              <User style={{ width: "20px", height: "20px", color: "#a855f7" }} />
            </div>
            <div>
              <p style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: 600, margin: 0 }}>โปรไฟล์</p>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "2px 0 0 0" }}>{user?.email}</p>
            </div>
          </div>

          <hr style={separatorStyle} />

          <div>
            <label style={labelStyle}>ชื่อที่แสดง</label>
            <input
              placeholder="ชื่อของคุณ"
              {...register("display_name")}
              style={getInputStyle("display_name")}
              onFocus={() => setFocusedField("display_name")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.display_name && (
              <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.display_name.message}</p>
            )}
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={labelStyle}>สกุลเงิน</label>
            <div
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "default",
              }}
            >
              <Coins style={{ width: "18px", height: "18px", color: "#a855f7" }} />
              <span style={{ color: "#f1f5f9", fontSize: "15px" }}>บาท (฿)</span>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={iconBoxStyle}>
              <Bell style={{ width: "20px", height: "20px", color: "#a855f7" }} />
            </div>
            <span style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: 600 }}>การแจ้งเตือนงบประมาณ</span>
          </div>

          <hr style={separatorStyle} />

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>แจ้งเตือนเมื่อใช้เกิน</span>
              <span style={{ color: "#a855f7", fontWeight: 600, fontSize: "15px" }}>{threshold}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "4px",
                cursor: "pointer",
                accentColor: "#a855f7",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ color: "#64748b", fontSize: "12px" }}>50%</span>
              <span style={{ color: "#64748b", fontSize: "12px" }}>100%</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            height: "50px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #a855f7, #9333ea)",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            boxShadow: "0 0 20px rgba(168,85,247,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {saving && <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />}
          บันทึกการตั้งค่า
        </button>
      </form>

      {/* App Info */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              ...iconBoxStyle,
              background: "rgba(148,163,184,0.15)",
            }}
          >
            <Info style={{ width: "20px", height: "20px", color: "#94a3b8" }} />
          </div>
          <div>
            <p style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: 600, margin: 0 }}>My Bill</p>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "2px 0 0 0" }}>เวอร์ชัน 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        type="button"
        style={{
          width: "100%",
          height: "50px",
          borderRadius: "12px",
          background: "transparent",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#ef4444",
          fontWeight: 600,
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <LogOut style={{ width: "18px", height: "18px" }} />
        ออกจากระบบ
      </button>
    </div>
  );
}
