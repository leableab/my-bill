import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  FileText,
  Gamepad2,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { value: "food", label: "อาหาร", icon: UtensilsCrossed, color: "#f97316" },
  { value: "transport", label: "เดินทาง", icon: Car, color: "#3b82f6" },
  { value: "bills", label: "บิล/ค่าใช้จ่าย", icon: FileText, color: "#8b5cf6" },
  { value: "shopping", label: "ช้อปปิ้ง", icon: ShoppingBag, color: "#ec4899" },
  { value: "health", label: "สุขภาพ", icon: Heart, color: "#22c55e" },
  { value: "entertainment", label: "บันเทิง", icon: Gamepad2, color: "#06b6d4" },
  { value: "education", label: "การศึกษา", icon: GraduationCap, color: "#f59e0b" },
  { value: "other", label: "อื่นๆ", icon: MoreHorizontal, color: "#64748b" },
];

export const INCOME_CATEGORIES: Category[] = [
  { value: "salary", label: "เงินเดือน", icon: Briefcase, color: "#22c55e" },
  { value: "freelance", label: "ฟรีแลนซ์", icon: Laptop, color: "#3b82f6" },
  { value: "investment", label: "การลงทุน", icon: TrendingUp, color: "#a855f7" },
  { value: "other_income", label: "รายได้อื่นๆ", icon: Coins, color: "#f59e0b" },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryByValue(value: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.value === value);
}

export function getCategoriesByType(type: "income" | "expense"): Category[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export const MONTHS_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export const MONTHS_TH_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.",
  "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.",
  "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
