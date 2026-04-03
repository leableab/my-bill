"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { BottomNav } from "@/components/bottom-nav";
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function TopBar() {
  const pathname = usePathname();
  if (pathname === "/settings") return null;

  return (
    <div className="flex justify-end" style={{ padding: "16px 20px 0 20px" }}>
      <Link
        href="/settings"
        className="flex items-center justify-center rounded-full transition-all"
        style={{
          width: "36px",
          height: "36px",
          background: "#131320",
          border: "1px solid #2a2a4a",
        }}
      >
        <Settings className="w-4 h-4" style={{ color: "#94a3b8" }} />
      </Link>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-dvh w-full" style={{ background: "#0a0a0f" }}>
          <div
            className="mx-auto w-full relative min-h-dvh"
            style={{ maxWidth: "430px", background: "#0a0a0f" }}
          >
            <TopBar />
            <main style={{ padding: "8px 20px 120px 20px" }}>
              {children}
            </main>
            <BottomNav />
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
