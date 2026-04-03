"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, User, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const registerSchema = z
  .object({
    displayName: z.string().min(1, "กรุณากรอกชื่อที่แสดง"),
    email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(6, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

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
};

const iconBox: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  background: "#1a1a2e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm" style={{ color: "#94a3b8", marginBottom: "8px" }}>
        {label}
      </label>
      <div className="flex items-center" style={{ gap: "10px" }}>
        <div style={iconBox}>
          <Icon style={{ width: "20px", height: "20px", color: "#64748b" }} />
        </div>
        {children}
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    const { error } = await signUp(data.email, data.password, data.displayName);
    if (error) {
      setError("ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง");
    } else {
      router.replace("/dashboard");
    }
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#a855f7";
    e.target.style.boxShadow = "0 0 15px rgba(168, 85, 247, 0.2)";
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#2a2a4a";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{
        padding: "20px",
        background: "linear-gradient(180deg, #0a0a0f 0%, #0d0820 50%, #0a0a0f 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div className="flex flex-col items-center" style={{ marginBottom: "32px" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "rgba(168, 85, 247, 0.15)",
              boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.15)",
              marginBottom: "20px",
            }}
          >
            <Wallet style={{ width: "40px", height: "40px", color: "#a855f7" }} />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              color: "#f1f5f9",
              textShadow: "0 0 20px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)",
              marginBottom: "4px",
            }}
          >
            My Bill
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>จัดการค่าใช้จ่ายอย่างชาญฉลาด</p>
        </div>

        {/* Card */}
        <div
          style={{
            borderRadius: "20px",
            padding: "28px 24px",
            background: "#131320",
            border: "1px solid #2a2a4a",
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.15), 0 0 60px rgba(168, 85, 247, 0.05)",
          }}
        >
          <h2 className="text-lg font-semibold text-center" style={{ color: "#f1f5f9", marginBottom: "24px" }}>
            สมัครสมาชิก
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label="ชื่อที่แสดง" icon={User} error={errors.displayName?.message}>
              <input type="text" placeholder="ชื่อของคุณ" style={{ ...inputStyle, flex: 1 }} {...register("displayName")} />
            </Field>

            <Field label="อีเมล" icon={Mail} error={errors.email?.message}>
              <input type="email" placeholder="your@email.com" style={{ ...inputStyle, flex: 1 }} {...register("email")} />
            </Field>

            <Field label="รหัสผ่าน" icon={Lock} error={errors.password?.message}>
              <input type="password" placeholder="••••••••" style={{ ...inputStyle, flex: 1 }} {...register("password")} />
            </Field>

            <Field label="ยืนยันรหัสผ่าน" icon={Lock} error={errors.confirmPassword?.message}>
              <input type="password" placeholder="••••••••" style={{ ...inputStyle, flex: 1 }} {...register("confirmPassword")} />
            </Field>

            {error && (
              <div style={{ borderRadius: "12px", padding: "12px", textAlign: "center", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-semibold text-white transition-all disabled:opacity-50"
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                marginTop: "4px",
                background: "linear-gradient(135deg, #a855f7, #9333ea)",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.1)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  กำลังสมัคร...
                </span>
              ) : (
                "สมัครสมาชิก"
              )}
            </button>
          </form>

          <p className="text-center" style={{ color: "#94a3b8", fontSize: "14px", marginTop: "24px" }}>
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="font-medium hover:underline" style={{ color: "#a855f7" }}>
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
