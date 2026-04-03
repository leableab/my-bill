"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, Plus, Wallet, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddTransactionSheet } from "@/components/add-transaction-sheet";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "หน้าแรก" },
  { href: "/transactions", icon: Receipt, label: "รายการ" },
  { href: "#add", icon: Plus, label: "เพิ่ม", isFab: true },
  { href: "/budget", icon: Wallet, label: "งบประมาณ" },
  { href: "/reports", icon: BarChart3, label: "รายงาน" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-bg-nav/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            if (item.isFab) {
              return (
                <button
                  key={item.href}
                  onClick={() => setShowAddSheet(true)}
                  className="flex items-center justify-center w-12 h-12 -mt-6 rounded-full bg-accent glow-purple hover:bg-accent-dark transition-all"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              );
            }

            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "glow-text")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AddTransactionSheet open={showAddSheet} onOpenChange={setShowAddSheet} />
    </>
  );
}
