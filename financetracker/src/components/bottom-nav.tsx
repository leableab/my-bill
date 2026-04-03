"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, Plus, Wallet, BarChart3 } from "lucide-react";
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
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
        style={{
          background: "rgba(10, 10, 18, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid #1e1e3a",
        }}
      >
        <div className="flex items-center justify-around px-2" style={{ height: "68px" }}>
          {navItems.map((item) => {
            if (item.isFab) {
              return (
                <button
                  key={item.href}
                  onClick={() => setShowAddSheet(true)}
                  className="flex items-center justify-center rounded-full transition-all"
                  style={{
                    width: "52px",
                    height: "52px",
                    marginTop: "-24px",
                    background: "linear-gradient(135deg, #a855f7, #9333ea)",
                    boxShadow: "0 0 25px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.15)",
                  }}
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
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
                style={{ color: isActive ? "#a855f7" : "#64748b" }}
              >
                <item.icon
                  className="w-5 h-5"
                  style={isActive ? { filter: "drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))" } : {}}
                />
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
