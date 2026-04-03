"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";

const loginSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
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
    <div className="min-h-dvh flex items-center justify-center px-4 bg-bg-primary">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4 glow-purple">
            <Wallet className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary glow-text">My Bill</h1>
          <p className="text-text-secondary text-sm mt-1">จัดการค่าใช้จ่ายอย่างชาญฉลาด</p>
        </div>

        <Card className="bg-bg-card border-border glow-purple-sm">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-text-primary text-center">เข้าสู่ระบบ</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-secondary text-sm">อีเมล</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 bg-bg-input border-border text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:ring-accent/20"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-text-secondary text-sm">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-bg-input border-border text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:ring-accent/20"
                    {...register("password")}
                  />
                </div>
                {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <p className="text-danger text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent-dark text-white font-medium glow-purple-sm hover:glow-purple transition-all"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                เข้าสู่ระบบ
              </Button>
            </form>

            <p className="text-center text-text-secondary text-sm mt-6">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-accent hover:underline font-medium">
                สมัครสมาชิก
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
