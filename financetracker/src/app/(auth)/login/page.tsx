"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const loginSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type LoginForm = z.infer<typeof loginSchema>;

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

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.replace("/dashboard");
    }
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
        <div className="flex flex-col items-center" style={{ marginBottom: "40px" }}>
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
          <h2
            className="text-lg font-semibold text-center"
            style={{ color: "#f1f5f9", marginBottom: "24px" }}
          >
            เข้าสู่ระบบ
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div>
              <label className="block text-sm" style={{ color: "#94a3b8", marginBottom: "8px" }}>
                อีเมล
              </label>
              <div className="flex items-center" style={{ gap: "10px" }}>
                <div className="flex items-center justify-center shrink-0" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#1a1a2e" }}>
                  <Mail style={{ width: "20px", height: "20px", color: "#64748b" }} />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{ ...inputStyle, flex: 1 }}
                  {...register("email")}
                />
              </div>
              {errors.email && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm" style={{ color: "#94a3b8", marginBottom: "8px" }}>
                รหัสผ่าน
              </label>
              <div className="flex items-center" style={{ gap: "10px" }}>
                <div className="flex items-center justify-center shrink-0" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#1a1a2e" }}>
                  <Lock style={{ width: "20px", height: "20px", color: "#64748b" }} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  style={{ ...inputStyle, flex: 1 }}
                  {...register("password")}
                />
              </div>
              {errors.password && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.password.message}</p>}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  borderRadius: "12px",
                  padding: "12px",
                  textAlign: "center",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>
              </div>
            )}

            {/* Submit */}
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
                background: "linear-gradient(135deg, #a855f7, #9333ea)",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.1)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          <p className="text-center" style={{ color: "#94a3b8", fontSize: "14px", marginTop: "24px" }}>
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="font-medium hover:underline" style={{ color: "#a855f7" }}>
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
