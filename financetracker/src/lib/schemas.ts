import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    error: "กรุณาเลือกประเภท",
  }),
  amount: z
    .number({ error: "กรุณากรอกจำนวนเงิน" })
    .positive("จำนวนเงินต้องมากกว่า 0"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  note: z.string().optional(),
  date: z.string().min(1, "กรุณาเลือกวันที่"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const budgetSchema = z.object({
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  monthly_limit: z
    .number({ error: "กรุณากรอกงบประมาณ" })
    .positive("งบประมาณต้องมากกว่า 0"),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

export const profileSchema = z.object({
  display_name: z.string().min(1, "กรุณากรอกชื่อ").max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร"),
  currency: z.string().default("฿"),
  budget_alert_threshold: z.number().min(50).max(100).default(80),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const loginSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  displayName: z.string().min(1, "กรุณากรอกชื่อ"),
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: z.string().min(6, "กรุณายืนยันรหัสผ่าน"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
